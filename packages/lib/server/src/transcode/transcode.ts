
import type { AlphaType, AssetType, DataOrError, DecodeOptions, EncodingType, StringDataOrError, Strings, TranscodeOptions, Transcoding, TranscodingType } from '@moviemasher/runtime-shared'

import { JsonExtension, KindsProbe, ProbeAlpha, isAboveZero, isTranscoding, outputAlphaOptions, outputOptions, sizeAboveZero, sizeCopy, sizeCover, sizeMax } from '@moviemasher/lib-shared'
import { EventServerAssetPromise, EventServerDecode, EventServerTranscode, EventServerTranscodeStatus, MovieMasher, ServerMediaRequest } from '@moviemasher/runtime-server'
import { ERROR, IMAGE, PROBE, SEQUENCE, VIDEO, namedError, errorPromise, errorThrow, isAssetType, isDate, isDefiniteError, isPopulatedString, isProbing } from '@moviemasher/runtime-shared'
import path from 'path'
import { ENV, ENVIRONMENT } from '../Environment/EnvironmentConstants.js'
import { ffmpegCommand, ffmpegInput, ffmpegOptions, ffmpegSavePromise } from '../RunningCommand/Command/CommandFactory.js'
import { JOB_TRANSCODING } from '../Utility/JobConstants.js'
import { jobHasErrored, jobHasFinished, jobHasStarted, jobGetStatus } from '../Utility/JobFunctions.js'
import { outputFileName } from '../Utility/OutputFunctions.js'

const transcodeEncodingType = (transcodingType: TranscodingType): EncodingType | undefined  =>{
  if (isAssetType(transcodingType)) return transcodingType

  if (transcodingType === SEQUENCE) return IMAGE
  return undefined
}

const transcode = async (transcodingType: TranscodingType, assetType: AssetType, request: ServerMediaRequest, user: string, id: string, options: TranscodeOptions, relativeRoot?: string): Promise<StringDataOrError> => {
  const orError = await transcodePromise(transcodingType, assetType, request, user, id, options, relativeRoot)
  if (isDefiniteError(orError)) await jobHasErrored(id, orError.error)
  return orError
}

const probePromise = async (filePath: string, assetType: AssetType, user: string, id: string): Promise<StringDataOrError> => {
  const decodeOptions: DecodeOptions = { types: KindsProbe }
  const request: ServerMediaRequest = {
    endpoint: filePath,
    path: filePath,
  }
  const event = new EventServerDecode(PROBE, assetType, request, user, id, decodeOptions)
  MovieMasher.eventDispatcher.dispatch(event)
  const { promise } = event.detail
  if (!promise) return namedError(ERROR.Unimplemented, EventServerDecode.Type)

  return await promise
}

const downloadAsset = async (request: ServerMediaRequest, assetType: AssetType, validDirectories?: Strings): Promise<StringDataOrError> => {
  const assetEvent = new EventServerAssetPromise(request, assetType, validDirectories)
  MovieMasher.eventDispatcher.dispatch(assetEvent)
  const { promise } = assetEvent.detail
  if (!promise) return namedError(ERROR.Unimplemented, EventServerAssetPromise.Type)
  
  return await promise
}

const transcodeFileName = (duration: number, commandOutput: TranscodeOptions): string => {
  const { videoRate } = commandOutput

  if (!isAboveZero(videoRate)) return errorThrow(ERROR.Internal)

  const { format, extension, basename = '' } = commandOutput
  const ext = extension || format
  // const { duration } = renderingOutput
  const framesMax = Math.floor(videoRate * duration) - 2
  const begin = 1
  const lastFrame = begin + (framesMax - begin)
  const padding = String(lastFrame).length
  return `${basename}%0${padding}d.${ext}`
}

const transcodePromise = async (transcodingType: TranscodingType, assetType: AssetType, request: ServerMediaRequest, user: string, id: string, transcodeOptions: TranscodeOptions, relativeRoot?: string): Promise<StringDataOrError> => {

  // save out job to indicate we're working on it
  const writeEmptyOrError = await jobHasStarted(id)
  if (isDefiniteError(writeEmptyOrError)) return writeEmptyOrError

  // make sure input file is local
  const downloadOrError = await downloadAsset(request, assetType)
  if (isDefiniteError(downloadOrError)) return downloadOrError

  const { data: inputPath } = downloadOrError

  // probe the input file 
  const inputProbeOrError = await probePromise(inputPath, assetType, '', JsonExtension)
  if (isDefiniteError(inputProbeOrError)) return inputProbeOrError

  const { data: json } = inputProbeOrError
  const probe = JSON.parse(json)
  if (!isProbing(probe)) return namedError(ERROR.Internal, 'input probe')

  const { [ProbeAlpha]: alpha } = probe.data

  const options = alpha ? outputAlphaOptions(transcodingType as AlphaType, transcodeOptions) : outputOptions(transcodingType, transcodeOptions)
  const { extension, format } = options
  const ext = extension || format 
  if (!isPopulatedString(ext)) return namedError(ERROR.Internal, 'output extension')
  let duration = 0
  switch(transcodingType) {
    case IMAGE:
    case VIDEO:
    case SEQUENCE: {
      // make sure we have output size
      if (!sizeAboveZero(options)) return namedError(ERROR.Internal, 'output size')

      const probeSize = sizeCopy(probe.data)
      if (!sizeAboveZero(probeSize)) return namedError(ERROR.Internal, 'input probe size')

      duration = probe.data.duration || 0

      // size is input size scaled to cover requested output size in either dimension
      const maxSize = sizeMax(options)
      const size = sizeCover(probeSize, maxSize)
      options.width = size.width
      options.height = size.height
    }
  }
  
  const fileName = transcodingType === SEQUENCE ? transcodeFileName(duration, options) : outputFileName(options, transcodingType)

  const outputPath = path.join(ENVIRONMENT.get(ENV.OutputRoot), user, id, fileName)
  
  const encodingType = transcodeEncodingType(transcodingType)
  if (encodingType) {
    const command = ffmpegCommand()
    ffmpegInput(command, inputPath)
    ffmpegOptions(command, options)
    const saveOrError = await ffmpegSavePromise(command, outputPath)
    if (isDefiniteError(saveOrError)) return saveOrError

    const endpoint = relativeRoot ? path.relative(relativeRoot, outputPath) : outputPath
    const data: Transcoding = { id, type: transcodingType, request: { endpoint } }

    const writeOrError = await jobHasFinished(id, data)
    if (isDefiniteError(writeOrError)) return writeOrError
    return { data: outputPath }
  } else {
    // font

    return errorPromise(ERROR.Unimplemented, 'font')
  }
}

const statusPromise = async (id: string): Promise<DataOrError<Transcoding | Date>> => {
  const orError = await jobGetStatus(id)
  if (isDefiniteError(orError) ) return orError

  const { data } = orError
  if (isDate(data) || isTranscoding(data)) return { data }

  return namedError(ERROR.Syntax, { ...data, name: JOB_TRANSCODING })
}

const statusHandler = (event: EventServerTranscodeStatus) => {
  const { detail } = event
  const { id } = detail
  detail.promise = statusPromise(id)
  event.stopImmediatePropagation()
}

const transcodeHandler = (event: EventServerTranscode) => {
  const { detail } = event
  const { user, id, transcodeOptions, transcodingType, assetType, request, relativeRoot } = detail
  detail.promise = transcode(transcodingType, assetType, request, user, id, transcodeOptions, relativeRoot)
}

export const ServerTranscodeListeners = () => ({
  [EventServerTranscode.Type]: transcodeHandler,
})

export const ServerTranscodeStatusListeners = () => ({
  [EventServerTranscodeStatus.Type]: statusHandler,
})
