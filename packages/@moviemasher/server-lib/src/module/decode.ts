import type { DecodeFunction, Decoding, Numbers, ProbingData, Scalar, ScalarRecord, Scanning, Sizes, Strings } from '@moviemasher/shared-lib/types.js'

import { $AUDIBLE, $DURATION, $RETRIEVE, $HEIGHT, $PROBE, $SCAN, $SIZE, $WIDTH, ERROR, MOVIEMASHER, NEWLINE, assertDecoding, errorCaught, errorPromise, isDefiniteError, isScanning, namedError } from '@moviemasher/shared-lib/runtime.js'
import { isNumeric, isPopulatedString } from '@moviemasher/shared-lib/utility/guard.js'
import { execSync } from 'child_process'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { filePathExists } from '../utility/file.js'
import { jobHasErrored, jobHasFinished, jobHasStarted } from '../utility/job.js'
import { isProbingOptions } from '../utility/guard.js'
import { assertPopulatedString } from '@moviemasher/shared-lib/utility/guards.js'

const AlphaFormatsCommand = "ffprobe -v 0 -of compact=p=0 -show_entries pixel_format=name:flags=alpha | grep 'alpha=1' | sed 's/.*=\\(.*\\)|.*/\\1/' "

let _alphaFormats: Strings

const alphaFormats = (): Strings => _alphaFormats ||= alphaFormatsInitialize()

const alphaFormatsInitialize = (): Strings => {
  const result = execSync(AlphaFormatsCommand).toString().trim()
  return result.split(NEWLINE)
}

const decode: DecodeFunction = async (args, options = {}) => {
  const { id } = options
  if (id) {
    const startedOrError = await jobHasStarted(id)
    if (isDefiniteError(startedOrError)) return startedOrError
  }
  const orError = await decodePromise(args, options)
  if (id) {
    if (isDefiniteError(orError)) await jobHasErrored(id, orError.error)
    else { 
      const { data } = orError
      assertDecoding(data)
      await jobHasFinished(id, data)
    }
  }
  return orError
}

const decodePromise: DecodeFunction = async (args, options) => {
  const { resource } = args
  const assetOrError = await MOVIEMASHER.promise($RETRIEVE, resource)
  if (isDefiniteError(assetOrError)) return assetOrError
   
  const { type: decodingType } = args
  switch(decodingType) {
    case $PROBE: return probePromise(args, options)
    case $SCAN: return scanPromise(args, options)
  }
  return errorPromise(ERROR.Unimplemented, decodingType)
}

const scanPromise: DecodeFunction = async args => {
  const { path: inputPath } = args.resource.request
  if (!filePathExists(inputPath)) return namedError(ERROR.Unavailable, inputPath)

  const result = execSync(`fc-scan -b ${inputPath}`).toString().trim()
  if (!result) return namedError(ERROR.Unavailable, $SCAN)

  const object: ScalarRecord = Object.fromEntries(result.split(NEWLINE).flatMap(line => {
    const [key, string] = line.split(':')
    if (!(key && string)) return []
    
    const trimmed = string.trim()
    const untyped = trimmed.split('(').shift()
    assertPopulatedString(untyped)
    const unquoted = untyped.replace(/"/g, '')
    let scalar: Scalar = unquoted
    switch (unquoted) {
      case 'True': scalar = true; break
      case 'False': scalar = false; break
      default:  {    
        if (isNumeric(unquoted)) scalar = Number(unquoted)
      }
    }
    return [[key.trim(), scalar]]
  }))
  const { family, file } = object
  if (isPopulatedString(file)) delete object.file
  if (!isPopulatedString(family)) return namedError(ERROR.Syntax, $SCAN)

  const data: Scanning = { type: $SCAN, data: {...object, family } }
  return { data }
}

const probePromise: DecodeFunction = args => {
  const { resource, options } = args
  const { path: inputPath } = resource.request
  if (!filePathExists(inputPath)) return errorPromise(ERROR.Unavailable, inputPath)
  if (!isProbingOptions(options)) return errorPromise(ERROR.Syntax, $PROBE)

  const { types } = options
  return new Promise(resolve => {
    const command = ffmpeg()
    command.addInput(inputPath)

    command.ffprobe((error: any, raw: ffmpeg.FfprobeData) => {
      if (error) resolve(errorCaught(error))
      else {
        const extension = path.extname(inputPath).slice(1)
        const probingData: ProbingData = { extension }
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
              case $SIZE: {
                if (pix_fmt && formats.includes(pix_fmt)) {
                  probingData.alpha = true
                }
                if (typeof rotation !== 'undefined') {
                  rotations.push(Math.abs(Number(rotation)))
                }
                if (width && height) sizes.push({ width, height })
                break
              }
              case $AUDIBLE: {
                if (codec_type === 'audio') {
                  probingData.audible = true
                }
                break
              }
              case $DURATION: {
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
            case $DURATION: {
              if (duration || durations.length) {
                if (durations.length) {
                  const maxDuration = Math.max(...durations)
                  probingData.duration = duration ? Math.max(maxDuration, duration) : maxDuration
                } else probingData.duration = duration
              }  
              break
            }
            case $SIZE: {
              if (sizes.length) {
                const flipped = rotations.some(n => n === 90 || n === 270)
                const widthKey = flipped ? $HEIGHT : $WIDTH
                const heightKey = flipped ? $WIDTH : $HEIGHT
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

        const data: Decoding = { type: $PROBE, data: probingData }
        resolve({ data }) 
      }
    })
  })
  // const probeOrError = await promise
  // if (!id || isDefiniteError(probeOrError)) return probeOrError

  // const { data: probing } = probeOrError
  // if (!isProbing(probing)) return namedError(ERROR.Syntax, $PROBE)

  // const writeOrError = await jobHasFinished(id, probing)
  // if (isDefiniteError(writeOrError)) return writeOrError

  // // not sure why we return this path??
  // const pathFragments = [ENV.get(ENV_KEY.OutputRoot)]
  // if (prefix) pathFragments.push(prefix)
  // pathFragments.push(id)
  // pathFragments.push([$PROBE, $JSON].join(DOT))
  // const probePath = path.resolve(...pathFragments)
  // return { data: probePath }
}

export const serverDecodeFunction: DecodeFunction = (args, jobOptions) => {
  return decode(args, jobOptions)
}