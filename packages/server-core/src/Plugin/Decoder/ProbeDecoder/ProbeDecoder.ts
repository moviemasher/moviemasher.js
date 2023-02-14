import ffmpeg from 'fluent-ffmpeg'
import { execSync } from "child_process";

import {
   assertProbeOptions, AudibleProbe, DecodeResponse, DecoderMethod, DurationProbe, errorCaught, Plugins, ProbeType, SizeProbe 
} from "@moviemasher/moviemasher.js";

const AlphaFormatsCommand = "ffprobe -v 0 -of compact=p=0 -show_entries pixel_format=name:flags=alpha | grep 'alpha=1' | sed 's/.*=\\(.*\\)|.*/\\1/' "

let _alphaFormats: string[]

const alphaFormats = (): string[] => {
    return _alphaFormats ||= alphaFormatsInitialize()
  }

const alphaFormatsInitialize = (): string[] => {
  const result = execSync(AlphaFormatsCommand).toString().trim()
  return result.split("\n")
}

export const decode: DecoderMethod = (localPath: string, options?: unknown): Promise<DecodeResponse> => {
  assertProbeOptions(options)
  const { types } = options

  const response: DecodeResponse = {}

  return new Promise<DecodeResponse>(resolve => {

    const command = ffmpeg()
    command.addInput(localPath)

    command.ffprobe((error: any, data: ffmpeg.FfprobeData) => {
      if (error) {
        resolve({ ...errorCaught(error), ...response })
      } else {
        const formats = alphaFormats()
        response.info = data
        const { streams, format } = data
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
                  response.alpha = true
                }
                break
              }
              case AudibleProbe: {
                if (codec_type === 'audio') {
                  response.audio = true
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
                  response.duration = duration ? Math.max(maxDuration, duration) : maxDuration
                } else response.duration = duration
              }  
              break
            }
            case SizeProbe: {
              if (sizes.length) {
                const flipped = rotations.some(n => n === 90 || n === 270)
                const widthKey = flipped ? 'height' : 'width'
                const heightKey = flipped ? 'width' : 'height'
                response[widthKey] = Math.max(...sizes.map(size => size.width))
                response[heightKey] = Math.max(...sizes.map(size => size.height))
              }        
              break
            }
          }
        })
      }
      resolve(response) 
    })
  })
}
Plugins.decoders[ProbeType] = { decode, type: ProbeType}
