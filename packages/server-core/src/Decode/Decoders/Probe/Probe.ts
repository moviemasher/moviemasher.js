import ffmpeg from 'fluent-ffmpeg'
import { execSync } from "child_process";

import { assertProbeOptions, ProbeType, DecodeType, errorFromAny } from "@moviemasher/moviemasher.js";
import { Decoder, DecodeResponse } from "../../Decode";
import { Decoders } from "../Decoders";

const AlphaFormatsCommand = "ffprobe -v 0 -of compact=p=0 -show_entries pixel_format=name:flags=alpha | grep 'alpha=1' | sed 's/.*=\\(.*\\)|.*/\\1/' "

let _alphaFormats: string[]

const alphaFormats = (): string[] => {
    return _alphaFormats ||= alphaFormatsInitialize()
  }

const alphaFormatsInitialize = (): string[] => {
  const result = execSync(AlphaFormatsCommand).toString().trim()
  return result.split("\n")
}

export const probe: Decoder = (localPath: string, options?: unknown): Promise<DecodeResponse> => {
  assertProbeOptions(options)
  const { types } = options

  const response: DecodeResponse = {}

  return new Promise<DecodeResponse>(resolve => {

    const command = ffmpeg()
    command.addInput(localPath)

    command.ffprobe((error: any, data: ffmpeg.FfprobeData) => {
      if (error) {
        resolve({ ...errorFromAny(error), ...response })
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
              case ProbeType.Alpha: {
                if (pix_fmt && formats.includes(pix_fmt)) {
                  response.alpha = true
                }
                break
              }
              case ProbeType.Audio: {
                if (codec_type === 'audio') {
                  response.audio = true
                }
                break
              }
              case ProbeType.Duration: {
                if (typeof duration !== 'undefined') {
                  durations.push(Number(duration))
                }
                break
              }
              case ProbeType.Size: {                
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
            
            case ProbeType.Duration: {
              if (duration || durations.length) {
                if (durations.length) {
                  const maxDuration = Math.max(...durations)
                  response.duration = duration ? Math.max(maxDuration, duration) : maxDuration
                } else response.duration = duration
              }  
              break
            }
            case ProbeType.Size: {
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

Decoders[DecodeType.Probe] = probe