
import type { AssetType, DataOrError, DecodeOptions, DefiniteError, EncodingType, StringDataOrError, TranscodeOptions, TranscodingObject, TranscodingType } from '@moviemasher/runtime-shared'

import { assertPopulatedString, outputOptions, JsonExtension, DOT, sizeCopy, sizeAboveZero, sizeCover, sizeMax, isTranscodingObject } from '@moviemasher/lib-shared'
import { EventServerAssetPromise, EventServerDecode, EventServerTranscode, EventServerTranscodeStatus, MovieMasher, ServerMediaRequest } from '@moviemasher/runtime-server'
import { ERROR, IMAGE, PROBE, SEQUENCE, TRANSCODE, VIDEO, error, errorPromise, isAssetType, isDefiniteError, isObject, isPopulatedString, isProbing } from '@moviemasher/runtime-shared'
import path from 'path'
import { ffmpegCommand, ffmpegInput, ffmpegOptions, ffmpegSavePromise } from '../RunningCommand/Command/CommandFactory.js'
import { ENV, ENVIRONMENT } from '../Environment/EnvironmentConstants.js'
import { fileCreatedPromise, filePathExists, fileReadPromise, fileWriteJsonPromise, fileWritePromise } from '../Utility/File.js'
import { KindsProbe } from '../decode/ProbeConstants.js'
import { outputFileName } from '../Utility/OutputFunctions.js'

const transcodeEncodingType = (transcodingType: TranscodingType): EncodingType | undefined  =>{
  if (isAssetType(transcodingType)) return transcodingType

  if (transcodingType === SEQUENCE) return IMAGE
  return undefined
}
const writeError = async (pathFragment: string, orError: DefiniteError): Promise<DefiniteError> => {
  const errorPath = transcodeOutputPath(pathFragment, ['error', JsonExtension].join(DOT))
  await fileWriteJsonPromise(errorPath, orError.error)
  return orError
}

const transcodeOutputPath = (pathFragment: string, name: string) => {
  return path.resolve(ENVIRONMENT.get(ENV.OutputRoot), pathFragment, name)
}

const transcode = async (transcodingType: TranscodingType, assetType: AssetType, request: ServerMediaRequest, pathFragment: string, options: TranscodeOptions): Promise<StringDataOrError> => {
  const orError = await transcodePromise(transcodingType, assetType, request, pathFragment, options)
  if (isDefiniteError(orError)) writeError(pathFragment, orError)
  return orError
}


const probePromise = async (filePath: string, assetType: AssetType, pathFragment: string): Promise<StringDataOrError> => {
  const decodeOptions: DecodeOptions = { types: KindsProbe }
  const request: ServerMediaRequest = {
    endpoint: filePath,
    path: filePath,
  }
  const event = new EventServerDecode(PROBE, assetType, request, pathFragment, decodeOptions)
  MovieMasher.eventDispatcher.dispatch(event)
  const { promise } = event.detail
  if (!promise) return error(ERROR.Unimplemented, EventServerDecode.Type)

  return await promise
}

const writeEmptyFile = async (pathFragment: string): Promise<StringDataOrError> => {
  const probePath = transcodeOutputPath(pathFragment, [TRANSCODE, JsonExtension].join(DOT))
  return await fileWritePromise(probePath, '')
}

const downloadAsset = async (request: ServerMediaRequest, assetType: AssetType): Promise<StringDataOrError> => {
  const assetEvent = new EventServerAssetPromise(request, assetType)
  MovieMasher.eventDispatcher.dispatch(assetEvent)
  const { promise } = assetEvent.detail
  if (!promise) return error(ERROR.Unimplemented, EventServerAssetPromise.Type)
  
  return await promise
}

const transcodePromise = async (transcodingType: TranscodingType, assetType: AssetType, request: ServerMediaRequest, pathFragment: string, transcodeOptions: TranscodeOptions): Promise<StringDataOrError> => {

  // save out empty file to indicate we're working on it
  const writeEmptyOrError = await writeEmptyFile(pathFragment)
  if (isDefiniteError(writeEmptyOrError)) return writeEmptyOrError

  // make sure input file is local
  const downloadOrError = await downloadAsset(request, assetType)
  if (isDefiniteError(downloadOrError)) return downloadOrError

  const { data: inputPath } = downloadOrError
  const options = outputOptions(transcodingType, transcodeOptions)

  const { extension, format } = options
  const ext = extension || format || path.extname(pathFragment).slice(1)
  if (!isPopulatedString(ext)) return error(ERROR.Internal, 'output extension')

  switch(transcodingType) {
    case IMAGE:
    case VIDEO:
    case SEQUENCE: {
      // make sure we have output size
      if (!sizeAboveZero(options)) return error(ERROR.Internal, 'output size')

      // probe the input file for size
      const inputProbeOrError = await probePromise(inputPath, assetType, JsonExtension)
      if (isDefiniteError(inputProbeOrError)) return inputProbeOrError

      const { data: json } = inputProbeOrError
      const probe = JSON.parse(json)
      if (!isProbing(probe)) return error(ERROR.Internal, 'input probe')
      const probeSize = sizeCopy(probe.data)
      if (!sizeAboveZero(probeSize)) return error(ERROR.Internal, 'input probe size')

      // size is input size scaled to cover requested output size in either dimension
      const maxSize = sizeMax(options)
      const size = sizeCover(probeSize, maxSize)
      options.width = size.width
      options.height = size.height
    }
  }
  
  const fileName = outputFileName(options, transcodingType)
  const outputPath = transcodeOutputPath(pathFragment, fileName)
  const encodingType = transcodeEncodingType(transcodingType)
  if (encodingType) {
    const command = ffmpegCommand()
    ffmpegInput(command, inputPath)
    ffmpegOptions(command, options)
    const saveOrError = await ffmpegSavePromise(command, outputPath)
    if (isDefiniteError(saveOrError)) return saveOrError

    const filePrefix = ENVIRONMENT.get(ENV.RelativeRequestRoot)

    const endpoint = path.relative(filePrefix, outputPath)
    const data: TranscodingObject = { type: transcodingType, request: { endpoint } }
    const writeOrError = await fileWriteJsonPromise(transcodeOutputPath(pathFragment, [TRANSCODE, JsonExtension].join(DOT)), data)

    if (isDefiniteError(writeOrError)) return writeOrError
    return { data: outputPath }

  } else {
    // font

    return errorPromise(ERROR.Unimplemented, 'font')
  }
}

const statusPromise = async (pathFragment: string): Promise<DataOrError<TranscodingObject | Date>> => {
  const transcodingPath = transcodeOutputPath(pathFragment, [TRANSCODE, JsonExtension].join(DOT))
  const errorPath = transcodeOutputPath(pathFragment, `error.${JsonExtension}`)
  if (filePathExists(errorPath)) {
    // an error was encountered while processing
    const errorStringOrError = await fileReadPromise(errorPath)
    // see if there was an error reading the file
    if (isDefiniteError(errorStringOrError)) return errorStringOrError

    const { data: errorString } = errorStringOrError
    // assume file hasn't finished writing if empty
    if (errorString) return { data: JSON.parse(errorString) }
  } else if (filePathExists(transcodingPath)) {
    // we at least started processing
    const resultStringOrError = await fileReadPromise(transcodingPath)
    
    // see if there was an error reading the file
    if (isDefiniteError(resultStringOrError)) return resultStringOrError
    
    const { data: resultString } = resultStringOrError
    // assume file hasn't finished writing if empty
    if (resultString) {
      const transcoding = JSON.parse(resultString)
      if (!isTranscodingObject(transcoding)) return error(ERROR.Internal, 'probe')
      
      return { data: transcoding }
    }
  }
  return await fileCreatedPromise(transcodingPath)
}

const statusHandler = (event: EventServerTranscodeStatus) => {
  const { detail } = event
  const { pathFragment } = detail
  detail.promise = statusPromise(pathFragment)
  event.stopImmediatePropagation()
}

const transcodeHandler = (event: EventServerTranscode) => {
  const { detail } = event
  const { pathFragment, transcodeOptions, transcodingType, assetType, request } = detail
  detail.promise = transcode(transcodingType, assetType, request, pathFragment, transcodeOptions)
}

export const ServerTranscodeListeners = () => ({
  [EventServerTranscode.Type]: transcodeHandler,
})

export const ServerTranscodeStatusListeners = () => ({
  [EventServerTranscodeStatus.Type]: statusHandler,
})
