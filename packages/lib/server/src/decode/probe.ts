import type { ServerMediaRequest } from '@moviemasher/runtime-server'
import type { AssetType, DataOrError, Decoding, ListenersFunction, Numbers, ProbingData, ProbingOptions, Sizes, StringDataOrError, Strings } from '@moviemasher/runtime-shared'

import { EventServerAssetPromise, EventServerDecode, EventServerDecodeStatus, MOVIEMASHER_SERVER } from '@moviemasher/runtime-server'
import { AUDIBLE, DOT, DURATION, ERROR, HEIGHT, JSON, NEWLINE, PROBE, SIZE_PROBING, WIDTH, errorCaught, isDate, isDefiniteError, isPopulatedString, isProbing, jsonParse, jsonStringify, namedError } from '@moviemasher/runtime-shared'
import { execSync } from 'child_process'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { ENV_KEY, ENV } from '../Environment/EnvironmentConstants.js'
import { filePathExists } from '../Utility/File.js'
import { DECODING } from '../Utility/JobConstants.js'
import { jobGetStatus, jobHasErrored, jobHasFinished, jobHasStarted } from '../Utility/JobFunctions.js'
import { assertProbingOptions } from './ProbeFunctions.js'

const AlphaFormatsCommand = "ffprobe -v 0 -of compact=p=0 -show_entries pixel_format=name:flags=alpha | grep 'alpha=1' | sed 's/.*=\\(.*\\)|.*/\\1/' "

let _alphaFormats: Strings

const alphaFormats = (): Strings => _alphaFormats ||= alphaFormatsInitialize()

const alphaFormatsInitialize = (): Strings => {
  const result = execSync(AlphaFormatsCommand).toString().trim()
  return result.split(NEWLINE)
}

const probe = async (request: ServerMediaRequest, options: ProbingOptions, user: string, id: string, assetType: AssetType): Promise<StringDataOrError> => {
  const orError = await probePromise(request, options, user, id, assetType)
  if (isDefiniteError(orError)) await jobHasErrored(id, orError.error)
  return orError
}

const probePromise = async (request: ServerMediaRequest, options: ProbingOptions, user: string, id: string, assetType: AssetType): Promise<StringDataOrError> => {
  const writingOutput = id !== JSON
  if (writingOutput) {
    const orError = await jobHasStarted(id)
    if (isDefiniteError(orError)) return orError
  }
  const assetEvent = new EventServerAssetPromise(request, assetType)
  MOVIEMASHER_SERVER.eventDispatcher.dispatch(assetEvent)
  const { promise: assetPromise } = assetEvent.detail
  if (!assetPromise) return namedError(ERROR.Unimplemented, EventServerAssetPromise.Type)
  
  const assetOrError = await assetPromise  
  if (isDefiniteError(assetOrError)) return assetOrError
  
  const { path: inputPath } = request

  assertProbingOptions(options)
  const { types } = options
  if (!filePathExists(inputPath)) return namedError(ERROR.Internal, `inputPath: ${inputPath}`)

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
              case SIZE_PROBING: {
                if (pix_fmt && formats.includes(pix_fmt)) {
                  probingData.alpha = true
                }
                if (typeof rotation !== 'undefined') {
                  rotations.push(Math.abs(Number(rotation)))
                }
                if (width && height) sizes.push({ width, height })
                break
              }
              case AUDIBLE: {
                if (codec_type === 'audio') {
                  probingData.audible = true
                }
                break
              }
              case DURATION: {
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
            case DURATION: {
              if (duration || durations.length) {
                if (durations.length) {
                  const maxDuration = Math.max(...durations)
                  probingData.duration = duration ? Math.max(maxDuration, duration) : maxDuration
                } else probingData.duration = duration
              }  
              break
            }
            case SIZE_PROBING: {
              if (sizes.length) {
                const flipped = rotations.some(n => n === 90 || n === 270)
                const widthKey = flipped ? HEIGHT : WIDTH
                const heightKey = flipped ? WIDTH : HEIGHT
                probingData[widthKey] = Math.max(...sizes.map(size => size.width))
                probingData[heightKey] = Math.max(...sizes.map(size => size.height))
              }        
              break
            }
          }
        })
        probingData.raw = raw

        const { filename: filePath } = format
        if (isPopulatedString(filePath)) delete format.filename


        const decoding: Decoding = { id, type: PROBE, data: probingData }
        resolve({ data: jsonStringify(decoding) }) 
      }
    })
  })

  const probeOrError = await promise
  if (isDefiniteError(probeOrError) || !writingOutput) return probeOrError

  const { data: json } = probeOrError

  const decoding = jsonParse(json)
  if (!isProbing(decoding)) return namedError(ERROR.Syntax, { probing: decoding })

  const writeOrError = await jobHasFinished(id, decoding)
  if (isDefiniteError(writeOrError)) return writeOrError

  const fileName = [PROBE, JSON].join(DOT)
  const probePath = path.resolve(ENV.get(ENV_KEY.OutputRoot), user, id, fileName)
  
  return { data: probePath }
}

const statusPromise = async (id: string): Promise<DataOrError<Decoding | Date>> => {
  const orError = await jobGetStatus(id)
  if (isDefiniteError(orError)) return orError

  const { data } = orError
  if (isDate(data) || isProbing(data)) return { data }

  return namedError(ERROR.Syntax, { ...data, name: DECODING })
}

const probeHandler = (event: EventServerDecode) => {
  const { detail } = event
  const { decodingType, request, decodeOptions, user, id, assetType } = detail
  if (decodingType !== PROBE) return

  assertProbingOptions(decodeOptions)
  
  detail.promise = probe(request, decodeOptions, user, id, assetType)
  event.stopImmediatePropagation()
}

const statusHandler = (event: EventServerDecodeStatus) => {
  const { detail } = event
  const { id } = detail
  console.log('PROBE statusHandler', id)
  detail.promise = statusPromise(id)
  event.stopImmediatePropagation()
}

export const ServerDecodeProbeListeners: ListenersFunction = () => ({
  [EventServerDecode.Type]: probeHandler,
})

export const ServerDecodeStatusListeners: ListenersFunction = () => ({
  [EventServerDecodeStatus.Type]: statusHandler,
})
