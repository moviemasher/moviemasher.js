
import type { ProbingData, } from '@moviemasher/lib-shared'
import type { DecodeOptions, DecodingObject, Numbers, Sizes, StringDataOrError, Strings } from '@moviemasher/runtime-shared'

import { JsonExtension, NewlineChar } from '@moviemasher/lib-shared'
import { EventServerDecode } from '@moviemasher/runtime-server'
import { PROBE, errorCaught } from '@moviemasher/runtime-shared'
import { execSync } from 'child_process'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import { ProbeAudible, ProbeDuration, ProbeSize } from './ProbeConstants.js'
import { assertProbeOptions } from './ProbeFunctions.js'

const AlphaFormatsCommand = "ffprobe -v 0 -of compact=p=0 -show_entries pixel_format=name:flags=alpha | grep 'alpha=1' | sed 's/.*=\\(.*\\)|.*/\\1/' "

let _alphaFormats: Strings

const alphaFormats = (): Strings => {
    return _alphaFormats ||= alphaFormatsInitialize()
  }

const alphaFormatsInitialize = (): Strings => {
  const result = execSync(AlphaFormatsCommand).toString().trim()
  return result.split(NewlineChar)
}

const probe = (inputPath: string, options: DecodeOptions, outputPath: string, decodingId: string): Promise<StringDataOrError> => {
  assertProbeOptions(options)
  const { types } = options
  return new Promise<StringDataOrError>(resolve => {
    const command = ffmpeg()
    command.addInput(inputPath)

    command.ffprobe((error: any, raw: ffmpeg.FfprobeData) => {
      if (error) resolve(errorCaught(error))
      else {
        const probingData: ProbingData = { raw }

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
        //id: decodingId, 
        const decoding: DecodingObject = { type: PROBE, data: probingData }
        const json = JSON.stringify(decoding)
        const data = { data: '' }
        if (outputPath === JsonExtension) data.data = json
        else {

          fs.writeFileSync(outputPath, json)
          data.data = outputPath
        } 
        resolve(data) 
      }
    })
  })
}

const handler = (event: EventServerDecode) => {
  const { detail } = event
  const { decodingType, inputPath, decodeOptions, outputPath, decodingId } = detail
  if (decodingType !== PROBE) return

  detail.promise = probe(inputPath, decodeOptions, outputPath, decodingId)
  event.stopImmediatePropagation()
}

export const ServerDecodeProbeListeners = () => ({
  [EventServerDecode.Type]: handler,
})
