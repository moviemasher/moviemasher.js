import ffmpeg from 'fluent-ffmpeg'
import { execSync } from 'child_process'
import { DecodeRequest, OutputType, errorFromAny, isString, PotentialError, DecodeResponse, assertString, DecodeOutput } from '@moviemasher/moviemasher.js'
import { inputPromise } from '../Utility/Job';

export class Decoder {
  private static AlphaFormatsCommand = "ffprobe -v 0 -of compact=p=0 -show_entries pixel_format=name:flags=alpha | grep 'alpha=1' | sed 's/.*=\\(.*\\)|.*/\\1/' "

  private static _alphaFormats?: string[]

  static get alphaFormats(): string[] {
    return this._alphaFormats ||= this.alphaFormatsInitialize
  }

  private static get alphaFormatsInitialize(): string[] {
    const result = execSync(this.AlphaFormatsCommand).toString().trim()
    return result.split("\n")
  }

  static async decode(localPath: string, output: DecodeOutput): Promise<DecodeResponse> {
  
   
    const response: DecodeResponse = {}
    const { type } = output

    const command = ffmpeg()
    command.addInput(localPath)


    return new Promise<DecodeResponse>(resolve => {
      command.ffprobe((error: any, data: ffmpeg.FfprobeData) => {
        if (error) {
          resolve({ ...errorFromAny(error), ...response })
        } else {

          response.info = data
          const { streams, format } = data
          const { duration = 0 } = format
          const durations: number[] = []
          const rotations: number[] = []
          const sizes: { width: number, height: number}[] = []
          for (const stream of streams) {
            const { rotation, width, height, duration, codec_type, pix_fmt } = stream
            if (type !== OutputType.Audio && pix_fmt) response.alpha = this.alphaFormats.includes(pix_fmt)
            if (typeof rotation !== 'undefined') rotations.push(Math.abs(Number(rotation)))
            if (type !== OutputType.Audio && codec_type === 'audio') response.audio = true
            if (typeof duration !== 'undefined') durations.push(Number(duration))
            if (width && height) sizes.push({ width, height })
          }
          if (type !== OutputType.Image && (duration || durations.length)) {
            if (durations.length) {
              const maxDuration = Math.max(...durations)
              response.duration = duration ? Math.max(maxDuration, duration) : maxDuration
            } else response.duration = duration
          }
          if (type !== OutputType.Audio && sizes.length) {
            const flipped = rotations.some(n => n === 90 || n === 270)
            const widthKey = flipped ? 'height' : 'width'
            const heightKey = flipped ? 'width' : 'height'
            response[widthKey] = Math.max(...sizes.map(size => size.width))
            response[heightKey] = Math.max(...sizes.map(size => size.height))
          }  
        }
        resolve(response) 
      })
    })
  }
}
