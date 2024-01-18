
import type { AbsolutePath, AlphaType, AssetType, DataOrError, DecodeOptions, ListenersFunction, ServerMediaRequest, Size, StringDataOrError, Strings, TranscodeOptions, Transcoding, TranscodingType } from '@moviemasher/shared-lib/types.js'
import type { CommandFilter, PathAndType } from '../types.js'

import { ALPHA, ERROR, IMAGE, JSON, MOVIEMASHER, PROBE, PROBING_TYPES, BITMAPS, VIDEO, WAVEFORM, errorPromise, errorThrow, isAssetType, isDate, isDefiniteError, isPopulatedString, isProbing, jsonParse, namedError, typeOutputAlphaOptions, typeOutputOptions } from '@moviemasher/shared-lib/runtime.js'
import { isAboveZero, isTranscoding } from '@moviemasher/shared-lib/utility/guards.js'
import { assertSizeAboveZero, sizeAboveZero, sizeCopy, sizeCover } from '@moviemasher/shared-lib/utility/rect.js'
import path from 'path'
import { ffmpegCommand, ffmpegFilters, ffmpegInput, ffmpegOptions, ffmpegSavePromise } from '../command/CommandFactory.js'
import { EventServerDecode, EventServerMediaPromise, EventServerTranscode, EventServerTranscodeStatus } from '../runtime.js'
import { sizeValueString } from '../utility/Command.js'
import { ENV, ENV_KEY } from '../utility/EnvironmentConstants.js'
import { fileNameFromOptions } from '../utility/File.js'
import { idUnique } from '../utility/Id.js'
import { TRANSCODING } from '../utility/JobConstants.js'
import { jobGetStatus, jobHasErrored, jobHasFinished, jobHasStarted } from '../utility/JobFunctions.js'

const isOutputType = (transcodingType: TranscodingType): boolean  =>{
  if (isAssetType(transcodingType)) return true

  if (transcodingType === BITMAPS || transcodingType === WAVEFORM) return true
  return false
}

export const transcode = async (request: ServerMediaRequest, id: string, options: TranscodeOptions, transcodingType: TranscodingType, assetType: AssetType, prefix?: string, relativeRoot?: string): Promise<StringDataOrError> => {
  const transcodeId = id || idUnique()
  
  const orError = await transcodePromise(request, transcodeId, options, transcodingType, assetType, prefix, relativeRoot)
  if (isDefiniteError(orError)) await jobHasErrored(transcodeId, orError.error)
  return orError
}

const probePromise = async (filePath: AbsolutePath, assetType: AssetType, user: string, id: string): Promise<StringDataOrError> => {
  const decodeOptions: DecodeOptions = { types: PROBING_TYPES }
  const request: ServerMediaRequest = {
    endpoint: filePath,
    path: filePath,
    type: assetType,
  }
  const event = new EventServerDecode(PROBE, assetType, request, user, id, decodeOptions)
  MOVIEMASHER.eventDispatcher.dispatch(event)
  const { promise } = event.detail
  if (!promise) return namedError(ERROR.Unimplemented, EventServerDecode.Type)

  return await promise
}

const downloadAsset = async (request: ServerMediaRequest, assetType: AssetType, validDirectories?: Strings): Promise<DataOrError<PathAndType>> => {
  const assetEvent = new EventServerMediaPromise(request, assetType, validDirectories)
  MOVIEMASHER.eventDispatcher.dispatch(assetEvent)
  const { promise } = assetEvent.detail
  if (!promise) return namedError(ERROR.Unimplemented, EventServerMediaPromise.Type)
  
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

const transcodePromise = async (request: ServerMediaRequest, id: string, transcodeOptions: TranscodeOptions, transcodingType: TranscodingType, assetType: AssetType, prefix?: string, relativeRoot?: string): Promise<StringDataOrError> => {

  // save out job to indicate we're working on it
  const writeEmptyOrError = await jobHasStarted(id)
  if (isDefiniteError(writeEmptyOrError)) return writeEmptyOrError

  // make sure input file is local
  // console.log('transcodePromise downloadAsset', request, assetType)
  const downloadOrError = await downloadAsset(request, assetType)
  if (isDefiniteError(downloadOrError)) return downloadOrError

  const { data: pathAndType } = downloadOrError

  // console.log('transcodePromise pathAndType', pathAndType)
  const { path: inputPath } = pathAndType

  // probe the input file 
  const inputProbeOrError = await probePromise(inputPath, assetType, '', JSON)
  if (isDefiniteError(inputProbeOrError)) return inputProbeOrError

  const { data: json } = inputProbeOrError

  
  const probe = jsonParse(json)
  if (!isProbing(probe)) return namedError(ERROR.Internal, 'input probe')

  // console.log('transcodePromise probe', probe)
  const { [ALPHA]: alpha } = probe.data

  const options = alpha ? typeOutputAlphaOptions(transcodingType as AlphaType, transcodeOptions) : typeOutputOptions(transcodingType, transcodeOptions)
  const { extension, format } = options
  const ext = extension || format 
  if (!isPopulatedString(ext)) return namedError(ERROR.Internal, 'output extension')
  let duration = 0
  switch(transcodingType) {
    case IMAGE:
    case VIDEO:
    case WAVEFORM: 
    case BITMAPS: {
      // make sure we have output size
      if (!sizeAboveZero(options)) return namedError(ERROR.Internal, 'output size')

      if (transcodingType === WAVEFORM) break

      const size = sizeCopy(probe.data)
      if (!sizeAboveZero(size)) return namedError(ERROR.Internal, 'input probe size')

      duration = probe.data.duration || 0

      // size is input size scaled to cover requested output size in either dimension      
      const { width, height } = options
      const max = Math.max(width, height)
      const maxSize = { width: max, height: max }
      const coverSize = sizeCover(size, maxSize)
      options.width = coverSize.width
      options.height = coverSize.height
    }
  }
  
  const fileName = transcodingType === BITMAPS ? transcodeFileName(duration, options) : fileNameFromOptions(options, transcodingType)

  const pathFragments = [ENV.get(ENV_KEY.OutputRoot)]
  if (prefix) pathFragments.push(prefix)
  pathFragments.push(id)
  pathFragments.push(fileName)
  const outputPath = path.join(...pathFragments)
  
  if (isOutputType(transcodingType)) {
    const command = ffmpegCommand()
    ffmpegInput(command, inputPath)
    ffmpegOptions(command, options)
    if (transcodingType === WAVEFORM) {
      assertSizeAboveZero(options)

      const compandFilter: CommandFilter = {
        inputs: ['0:a'],
        outputs: ['COMPAND'],
        ffmpegFilter: 'compand', 
        options: {}
      }
      const commandFilter: CommandFilter = {
        inputs: ['COMPAND'],
        outputs: [],
        ffmpegFilter: 'showwavespic', 
        options: { split_channels: 1, draw: 'full', s: sizeValueString(options), colors: 'white|white' }
      }
      ffmpegFilters(command, [compandFilter, commandFilter])
    }
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

  return namedError(ERROR.Syntax, { ...data, name: TRANSCODING })
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
  detail.promise = transcode(request, id, transcodeOptions, transcodingType, assetType, user, relativeRoot)
}

export const ServerTranscodeListeners: ListenersFunction = () => ({
  [EventServerTranscode.Type]: transcodeHandler,
})

export const ServerTranscodeStatusListeners: ListenersFunction = () => ({
  [EventServerTranscodeStatus.Type]: statusHandler,
})
