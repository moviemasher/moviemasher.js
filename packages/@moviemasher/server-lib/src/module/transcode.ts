
import type { CommandFilter, AbsolutePath, AbsolutePaths, AlphaType, DataOrError, DecodeArgs, DecodeOptions, DropResource, DropType, EndpointRequest, Probing, RawType, Resource, StringDataOrError, TranscodeFunction, TranscodeOptions, Transcoding, TranscodingType } from '@moviemasher/shared-lib/types.js'
import type {  } from '../types.js'

import { $ALPHA, $BITMAPS, $CEIL, $DECODE, $RETRIEVE, $IMAGE, $PROBE, $VIDEO, $WAVEFORM, ERROR, MOVIE_MASHER, PROBING_TYPES, errorPromise, isDefiniteError, isProbing, isRawType, namedError, typeOutputAlphaOptions, typeOutputOptions } from '@moviemasher/shared-lib/runtime.js'
import { isPopulatedString } from '@moviemasher/shared-lib/utility/guard.js'
import { assertAbsolutePath, assertAboveZero, assertAssetResource, assertDefined } from '@moviemasher/shared-lib/utility/guards.js'
import { sizeValueString, assertSizeNotZero, coverSize, evenSize, sizeNotZero } from '@moviemasher/shared-lib/utility/rect.js'
import path from 'path'
import { ffmpegCommand, ffmpegFilters, ffmpegInput, ffmpegOptions, ffmpegSavePromise } from '../command/CommandFactory.js'
import {  } from '../utility/command.js'
import { ENV, $RelativeRequestRoot, $OutputRoot } from '../utility/env.js'
import { fileNameFromOptions } from './file.js'
import { idUnique } from '../utility/id.js'
import { jobHasErrored, jobHasFinished, jobHasStarted } from '../utility/job.js'

const isOutputType = (transcodingType: TranscodingType): boolean => {
  if (isRawType(transcodingType)) return true

  return (transcodingType === $BITMAPS || transcodingType === $WAVEFORM) 
}

const transcode = async (request: EndpointRequest, options: TranscodeOptions, transcodingType: TranscodingType, assetType: RawType, id?: string, prefix?: string): Promise<StringDataOrError> => {
  const transcodeId = id || idUnique()
  
  const orError = await transcodePromise(request, transcodeId, options, transcodingType, assetType, prefix)
  if (isDefiniteError(orError)) await jobHasErrored(transcodeId, orError.error)
  return orError
}

const probePromise = async (filePath: AbsolutePath, type: DropType): Promise<DataOrError<Probing>> => {
  const decodeOptions: DecodeOptions = { types: PROBING_TYPES }
  const request: EndpointRequest = { endpoint: filePath, path: filePath }
  const resource: DropResource = { request, type }
  assertAssetResource(resource, 'probePromise')
  const args: DecodeArgs = { resource, type: $PROBE, options: decodeOptions }
  const promise = MOVIE_MASHER.promise(args, $DECODE)
 
  return await promise
}

const downloadAsset = async (resource: Resource, validDirectories?: AbsolutePaths): Promise<StringDataOrError> => {
  return await MOVIE_MASHER.promise(resource, $RETRIEVE, { validDirectories })
}

const transcodeFileName = (duration: number, commandOutput: TranscodeOptions): string => {
  const { videoRate } = commandOutput
  assertAboveZero(videoRate, 'videoRate')

  const { format, extension, basename = '' } = commandOutput
  const ext = extension || format
  // const { duration } = renderingOutput
  const framesMax = Math.floor(videoRate * duration) - 2
  const begin = 1
  const lastFrame = begin + (framesMax - begin)
  const padding = String(lastFrame).length
  return `${basename}%0${padding}d.${ext}`
}

const transcodePromise = async (request: EndpointRequest, id: string, transcodeOptions: TranscodeOptions, transcodingType: TranscodingType, assetType: RawType, prefix?: string): Promise<StringDataOrError> => {
  // save out job to indicate we're working on it
  const writeEmptyOrError = await jobHasStarted(id)
  if (isDefiniteError(writeEmptyOrError)) return writeEmptyOrError

  // make sure input file is local
  const resource: Resource = { request, type: assetType }
  const downloadOrError = await downloadAsset(resource)
  if (isDefiniteError(downloadOrError)) return downloadOrError

  const { data: inputPath } = downloadOrError
  assertAbsolutePath(inputPath, 'inputPath')
  // probe the input file 
  const inputProbeOrError = await probePromise(inputPath, assetType)
  if (isDefiniteError(inputProbeOrError)) return inputProbeOrError

  const { data: probe } = inputProbeOrError
  if (!isProbing(probe)) return namedError(ERROR.Internal, 'input probe')

  const { [$ALPHA]: alpha } = probe.data
  const options = alpha ? typeOutputAlphaOptions(transcodingType as AlphaType, transcodeOptions) : typeOutputOptions(transcodingType, transcodeOptions)
  const { extension, format } = options
  const ext = extension || format 
  if (!isPopulatedString(ext)) return namedError(ERROR.Internal, 'output extension')
  let duration = 0
  switch(transcodingType) {
    case $IMAGE:
    case $VIDEO:
    case $WAVEFORM: 
    case $BITMAPS: {
      // make sure we have output size
      if (!sizeNotZero(options)) return namedError(ERROR.Internal, 'output size')

      if (transcodingType === $WAVEFORM) break

      const { width: probeWidth = 0, height: probeHeight = 0 } = probe.data
      const size = { width: probeWidth, height: probeHeight}
      if (!sizeNotZero(size)) return namedError(ERROR.Internal, 'input probe size')

      duration = probe.data.duration || 0

      // size is input size scaled to cover requested output size in either dimension      
      const { width, height } = options
      const max = Math.max(width, height)
      const maxSize = { width: max, height: max }
      const coveredSize = evenSize(coverSize(size, maxSize), $CEIL)
      options.width = coveredSize.width
      options.height = coveredSize.height
    }
  }
  
  const fileName = transcodingType === $BITMAPS ? transcodeFileName(duration, options) : fileNameFromOptions(options, transcodingType)

  const pathFragments = [ENV.get($OutputRoot)]
  if (prefix) pathFragments.push(prefix)
  pathFragments.push(id)
  pathFragments.push(fileName)
  const outputPath = path.join(...pathFragments)
  const relativeRoot = ENV.get($RelativeRequestRoot)
  if (isOutputType(transcodingType)) {
    const command = ffmpegCommand()
    ffmpegInput(command, inputPath)
    ffmpegOptions(command, options)
    if (transcodingType === $WAVEFORM) {
      assertSizeNotZero(options)

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
        options: { 
          split_channels: 1, 
          draw: 'full', 
          s: sizeValueString(options), 
          colors: 'white|white' 
        }
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

export const serverTranscodeFunction: TranscodeFunction = (args, jobOptions = {}) => {
  if (!args) return errorPromise(ERROR.Syntax, args)

  const { user, id } = jobOptions
  const { resource, options, type: transcodingType} = args
  const { request, type: assetType } = resource

  return transcode(request, options, transcodingType, assetType, id, user)
}