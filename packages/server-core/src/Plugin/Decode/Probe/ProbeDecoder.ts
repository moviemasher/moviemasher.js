import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import fs from 'fs'

import { execSync } from "child_process";

import {
   assertProbeOptions, AudibleProbe, DecodeMethod, DecodeType, Decoding, DurationProbe, 
   errorCaught, idGenerateString, JsonExtension, PathData, PathDataOrError, 
   Plugins, ProbeType, ProbingData, SizeProbe 
} from "@moviemasher/moviemasher.js";
import { environment, Environment } from '../../../Environment/Environment';

const AlphaFormatsCommand = "ffprobe -v 0 -of compact=p=0 -show_entries pixel_format=name:flags=alpha | grep 'alpha=1' | sed 's/.*=\\(.*\\)|.*/\\1/' "

let _alphaFormats: string[]

const alphaFormats = (): string[] => {
    return _alphaFormats ||= alphaFormatsInitialize()
  }

const alphaFormatsInitialize = (): string[] => {
  const result = execSync(AlphaFormatsCommand).toString().trim()
  return result.split("\n")
}

const decode: DecodeMethod = (localPath: string, options?: unknown): Promise<PathDataOrError> => {
  assertProbeOptions(options)
  const { types } = options

  return new Promise<PathDataOrError>(resolve => {
    const command = ffmpeg()
    command.addInput(localPath)

    command.ffprobe((error: any, raw: ffmpeg.FfprobeData) => {
      if (error) resolve(errorCaught(error))
      else {
        const probingData: ProbingData = { raw }

        const formats = alphaFormats()
        const { streams, format } = raw
        const { duration = 0 } = format
        const durations: number[] = []
        const rotations: number[] = []
        const sizes: { width: number, height: number}[] = []
        for (const stream of streams) {
          const { rotation, width, height, duration, codec_type, pix_fmt } = stream
          types.forEach(type => {
            switch(type) {
              case SizeProbe: {
                if (pix_fmt && formats.includes(pix_fmt)) {
                  probingData.alpha = true
                }
                break
              }
              case AudibleProbe: {
                if (codec_type === 'audio') {
                  probingData.audible = true
                }
                break
              }
              case DurationProbe: {
                if (typeof duration !== 'undefined') {
                  durations.push(Number(duration))
                }
                break
              }
              case SizeProbe: {                
                if (typeof rotation !== 'undefined') {
                  rotations.push(Math.abs(Number(rotation)))
                }
                if (width && height) sizes.push({ width, height })
                break
              }
            }
          })
        }
        types.forEach(type => {
          switch(type) {
            case DurationProbe: {
              if (duration || durations.length) {
                if (durations.length) {
                  const maxDuration = Math.max(...durations)
                  probingData.duration = duration ? Math.max(maxDuration, duration) : maxDuration
                } else probingData.duration = duration
              }  
              break
            }
            case SizeProbe: {
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
        const data: Decoding = { id, type: ProbeType, data: probingData }
        // const decodeData: DecodeData = { data }
        
        const temporaryDirectory = environment(Environment.API_DIR_TEMPORARY)
        const filePath = path.resolve(temporaryDirectory, `${id}.${JsonExtension}`)
        fs.writeFileSync(filePath, JSON.stringify(data))
        const pathData: PathData = { path: filePath }
        resolve(pathData) 
      }
    })
  })
}
Plugins[DecodeType][ProbeType] = { decode, type: ProbeType}
