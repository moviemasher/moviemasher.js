import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'

import { execSync } from "child_process"

import {
  assertProbeOptions, ProbeAudible, DecodeMethod, TypeDecode, Decoding, 
  ProbeDuration, errorCaught, idGenerateString, JsonExtension, NewlineChar, 
 StringDataOrError, TypeProbe, ProbingData, Runtime, ProbeSize
} from "@moviemasher/lib-shared"
import { EnvironmentKeyApiDirTemporary } from '../../../Environment/ServerEnvironment.js'
import { Numbers } from '@moviemasher/runtime-shared'

const AlphaFormatsCommand = "ffprobe -v 0 -of compact=p=0 -show_entries pixel_format=name:flags=alpha | grep 'alpha=1' | sed 's/.*=\\(.*\\)|.*/\\1/' "

let _alphaFormats: string[]

const alphaFormats = (): string[] => {
    return _alphaFormats ||= alphaFormatsInitialize()
  }

const alphaFormatsInitialize = (): string[] => {
  const result = execSync(AlphaFormatsCommand).toString().trim()
  return result.split(NewlineChar)
}

const decode: DecodeMethod = (localPath: string, options?: unknown): Promise<StringDataOrError> => {
  assertProbeOptions(options)
  const { types } = options

  return new Promise<StringDataOrError>(resolve => {
    const command = ffmpeg()
    command.addInput(localPath)

    command.ffprobe((error: any, raw: ffmpeg.FfprobeData) => {
      if (error) resolve(errorCaught(error))
      else {
        const probingData: ProbingData = { raw }

        const formats = alphaFormats()
        const { streams, format } = raw
        const { duration = 0 } = format
        const durations: Numbers = []
        const rotations: Numbers = []
        const sizes: { width: number, height: number}[] = []
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
        const id = idGenerateString()
        const decoding: Decoding = { id, type: TypeProbe, data: probingData }
        // const decodeData: DecodeData = { data }
        const { environment } = Runtime
        const temporaryDirectory = environment.get(EnvironmentKeyApiDirTemporary)
        const data = path.resolve(temporaryDirectory, `${id}.${JsonExtension}`)
        fs.writeFileSync(data, JSON.stringify(decoding))
        resolve({ data }) 
      }
    })
  })
}
Runtime.plugins[TypeDecode][TypeProbe] ||= { 
  decode, type: TypeDecode, decodingType: TypeProbe
}
