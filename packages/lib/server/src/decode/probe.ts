
import type { ServerMediaRequest } from '@moviemasher/runtime-server'
import type { AssetType, DataOrError, DecodeOptions, DecodingObject, DefiniteError, Numbers, ProbingData, Sizes, StringDataOrError, Strings, } from '@moviemasher/runtime-shared'

import { DOT, JsonExtension, NEWLINE } from '@moviemasher/lib-shared'
import { EventServerAssetPromise, EventServerDecode, EventServerDecodeStatus, MovieMasher } from '@moviemasher/runtime-server'
import { ERROR, PROBE, error, errorCaught, isDefiniteError, isObject, isPopulatedString, isProbing } from '@moviemasher/runtime-shared'
import { execSync } from 'child_process'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { ENV, ENVIRONMENT } from '../Environment/EnvironmentConstants.js'
import { fileCreatedPromise, filePathExists, fileReadPromise, fileWriteJsonPromise, fileWritePromise } from '../Utility/File.js'
import { ProbeAudible, ProbeDuration, ProbeSize } from './ProbeConstants.js'
import { assertProbeOptions } from './ProbeFunctions.js'

const AlphaFormatsCommand = "ffprobe -v 0 -of compact=p=0 -show_entries pixel_format=name:flags=alpha | grep 'alpha=1' | sed 's/.*=\\(.*\\)|.*/\\1/' "

let _alphaFormats: Strings

const alphaFormats = (): Strings => {
    return _alphaFormats ||= alphaFormatsInitialize()
  }

const alphaFormatsInitialize = (): Strings => {
  const result = execSync(AlphaFormatsCommand).toString().trim()
  return result.split(NEWLINE)
}


const writeError = async (pathFragment: string, orError: DefiniteError): Promise<DefiniteError> => {
  const errorPath = decodeOutputPath(pathFragment, ['error', JsonExtension].join(DOT))
  await fileWriteJsonPromise(errorPath, orError.error)
  return orError
}

const probe = async (request: ServerMediaRequest, options: DecodeOptions, pathFragment: string, assetType: AssetType): Promise<StringDataOrError> => {
  const orError = await probePromise(request, options, pathFragment, assetType)
  if (isDefiniteError(orError)) writeError(pathFragment, orError)
  return orError
}


const probePromise = async (request: ServerMediaRequest, options: DecodeOptions, pathFragment: string, assetType: AssetType): Promise<StringDataOrError> => {
  const writingOutput = pathFragment !== JsonExtension

  const probePath = decodeOutputPath(pathFragment, [PROBE, JsonExtension].join(DOT))
  const orError = await fileWritePromise(probePath, '')
  if (isDefiniteError(orError)) return orError
  
  const assetEvent = new EventServerAssetPromise(request, assetType)
  MovieMasher.eventDispatcher.dispatch(assetEvent)
  const { promise: assetPromise } = assetEvent.detail
  if (!assetPromise) return error(ERROR.Unimplemented, EventServerAssetPromise.Type)
  
  const assetOrError = await assetPromise  
  if (isDefiniteError(assetOrError)) return assetOrError
  
  const { path: inputPath } = request

  assertProbeOptions(options)
  const { types } = options
  if (!filePathExists(inputPath)) return error(ERROR.Internal, `inputPath ${inputPath}`)

  const promise = new Promise<StringDataOrError>(resolve => {
    const command = ffmpeg()
    command.addInput(inputPath)

    command.ffprobe((error: any, raw: ffmpeg.FfprobeData) => {
      if (error) resolve(errorCaught(error))
      else {
        const probingData: ProbingData = {}
        const formats = alphaFormats()
        const { streams, format } = raw
        const { duration = 0 } = format
        const durations: Numbers = []
        const rotations: Numbers = []
        const sizes: Sizes = []
        for (const stream of streams) {
          const { rotation, width, height, duration, codec_type, pix_fmt } = stream
          types.forEach(type => {
            switch(type) {
              case ProbeSize: {
                if (pix_fmt && formats.includes(pix_fmt)) {
                  probingData.alpha = true
                }
                if (typeof rotation !== 'undefined') {
                  rotations.push(Math.abs(Number(rotation)))
                }
                if (width && height) sizes.push({ width, height })
                break
              }
              case ProbeAudible: {
                if (codec_type === 'audio') {
                  probingData.audible = true
                }
                break
              }
              case ProbeDuration: {
                if (typeof duration !== 'undefined') {
                  durations.push(Number(duration))
                }
                break
              }
            }
          })
        }
        types.forEach(type => {
          switch(type) {
            case ProbeDuration: {
              if (duration || durations.length) {
                if (durations.length) {
                  const maxDuration = Math.max(...durations)
                  probingData.duration = duration ? Math.max(maxDuration, duration) : maxDuration
                } else probingData.duration = duration
              }  
              break
            }
            case ProbeSize: {
              if (sizes.length) {
                const flipped = rotations.some(n => n === 90 || n === 270)
                const widthKey = flipped ? 'height' : 'width'
                const heightKey = flipped ? 'width' : 'height'
                probingData[widthKey] = Math.max(...sizes.map(size => size.width))
                probingData[heightKey] = Math.max(...sizes.map(size => size.height))
              }        
              break
            }
          }
        })
        probingData.raw = raw
        const decoding: DecodingObject = { type: PROBE, data: probingData }
        const json = JSON.stringify(decoding)
        resolve({ data: json }) 
      }
    })
  })

  const probeOrError = await promise
  if (isDefiniteError(probeOrError) || !writingOutput) return probeOrError

  const { data: json } = probeOrError
  const writeOrError = await fileWritePromise(probePath, json)
  if (isDefiniteError(writeOrError)) return writeOrError

  return { data: probePath }
}


const decodeOutputPath = (pathFragment: string, name: string) => {
  return path.resolve(ENVIRONMENT.get(ENV.OutputRoot), pathFragment, name)
}

const statusPromise = async (pathFragment: string): Promise<DataOrError<DecodingObject | Date>> => {
  const probePath = decodeOutputPath(pathFragment, [PROBE, JsonExtension].join(DOT))
  const errorPath = decodeOutputPath(pathFragment, `error.${JsonExtension}`)
  if (filePathExists(errorPath)) {
    // an error was encountered while rendering
    const errorStringOrError = await fileReadPromise(errorPath)
    // see if there was an error reading the file
    if (isDefiniteError(errorStringOrError)) return errorStringOrError

    const { data: errorString } = errorStringOrError
    // assume file hasn't finished writing if empty
    if (errorString) return { data: JSON.parse(errorString) }
  } else if (filePathExists(probePath)) {
    // we finished encoding and at least started probing
    const probeStringOrError = await fileReadPromise(probePath)
    
    // see if there was an error reading the file
    if (isDefiniteError(probeStringOrError)) return probeStringOrError
    
    const { data: probeString } = probeStringOrError
    // assume file hasn't finished writing if empty
    if (probeString) {
      const probe = JSON.parse(probeString)
      if (!isProbing(probe)) return error(ERROR.Internal, 'probe')
      const { raw } = probe.data
      if (!isObject(raw)) return error(ERROR.Internal, 'probe raw')
      const { format } = raw
      if (!isObject(format)) return error(ERROR.Internal, 'raw format')
      
      const { filename: filePath } = format
      if (isPopulatedString(filePath)) delete format.filename

      return { data: probe }
    }
  }
  return await fileCreatedPromise(probePath)
}

const probeHandler = (event: EventServerDecode) => {
  const { detail } = event
  const { decodingType, request, decodeOptions, pathFragment, assetType } = detail
  if (decodingType !== PROBE) return

  detail.promise = probe(request, decodeOptions, pathFragment, assetType)
  event.stopImmediatePropagation()
}

const statusHandler = (event: EventServerDecodeStatus) => {
  const { detail } = event
  const { pathFragment } = detail
  detail.promise = statusPromise(pathFragment)
  event.stopImmediatePropagation()
}

export const ServerDecodeProbeListeners = () => ({
  [EventServerDecode.Type]: probeHandler,
})


export const ServerDecodeStatusListeners = () => ({
  [EventServerDecodeStatus.Type]: statusHandler,
})


