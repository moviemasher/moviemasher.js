import path from "path"
import fs from 'fs'
import Ffmpeg from "fluent-ffmpeg"
import type { LoadedInfo, Sizes } from "@moviemasher/moviemasher.js"
 
import { isPositive, SizeZero, isNumeric, isPopulatedString } from "@moviemasher/moviemasher.js"

import { commandProcess } from "../CommandFactory"
import { commandArgsString } from "../../Utility/Command"
import { expandCommand } from "../../Utility/Expand"

export class Probe {
  private static AlphaFormatsCommand = "ffprobe -v 0 -of compact=p=0 -show_entries pixel_format=name:flags=alpha | grep 'alpha=1' | sed 's/.*=\\(.*\\)|.*/\\1/' "

  private static _alphaFormats?: string[]
  static get alphaFormats(): string[] {
    return this._alphaFormats ||= this.alphaFormatsInitialize
  }
  private static get alphaFormatsInitialize(): string[] {
    const result = expandCommand(this.AlphaFormatsCommand)
    return result.split("\n")
  }

  private static probeFile(src: string): string {
    const match = src.match(/%0([0-9]*)d/)
    if (!match) return src

    const parentDir = path.dirname(src)
    const ext = path.extname(src)
    const [_, digit] = match  
    const zeros = '0'.repeat(Number(digit) - 1)
    return path.join(parentDir, `${zeros}1${ext}`)
  }

  static promise(temporaryDirectory: string, file: string, destination?: string): Promise<LoadedInfo> {
    const src = this.probeFile(file)
    const relative = path.relative('./', file)
    const parentDir = path.dirname(src)
    if (!fs.existsSync(src)) return Promise.reject(`${relative} does not exist`)
    if (!fs.statSync(src).size) return Promise.reject(`${relative} is empty`)
    
    const dest = destination || path.join(parentDir, `${path.basename(src)}.json`)
    if (fs.existsSync(dest)) {
      return fs.promises.readFile(dest).then(buffer => (
        JSON.parse(buffer.toString()) as LoadedInfo
      ))
    }

    const process = commandProcess()
    process.addInput(src)
    return new Promise((resolve, reject) => {
      fs.promises.mkdir(path.dirname(dest), { recursive: true }).then(() => {
        process.ffprobe((error: any, data: Ffmpeg.FfprobeData) => {
          const info: LoadedInfo = { 
            audible: false, ...SizeZero, info: data, 
            extension: path.extname(src).slice(1)
          }
          if (error) {
            info.error = commandArgsString(process._getArguments(), dest, error)
          } else {
            const { streams, format } = data
            const { duration = 0 } = format
            const durations: number[] = []
            const rotations: number[] = []
            const sizes: Sizes = []
            for (const stream of streams) {
              const { rotation, width, height, duration, codec_type, pix_fmt } = stream
              if (isPopulatedString(pix_fmt)) info.alpha = this.alphaFormats.includes(pix_fmt)
              if (isNumeric(rotation)) rotations.push(Math.abs(Number(rotation)))
              if (codec_type === 'audio') info.audible = true
              if (isPositive(duration)) durations.push(Number(duration))
              if (width && height) sizes.push({ width, height })
            }

            if (duration || durations.length) {
              if (durations.length) {
                const maxDuration = Math.max(...durations)
                info.duration = duration ? Math.max(maxDuration, duration) : maxDuration
              } else info.duration = duration
            }
            if (sizes.length) {
              const flipped = rotations.some(n => n === 90 || n === 270)
              const widthKey = flipped ? 'height' : 'width'
              const heightKey = flipped ? 'width' : 'height'
              info[widthKey] = Math.max(...sizes.map(size => size.width))
              info[heightKey] = Math.max(...sizes.map(size => size.height))
            }  
          }
          fs.promises.writeFile(dest, JSON.stringify(info)).then(() => { resolve(info) })
        })
      })
    })
  }
}

// const data = {
//         streams: [
//           {
//             index: 0,
//             codec_name: 'h264',
//             codec_long_name: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10',
//             profile: 'High',
//             codec_type: 'video',
//             codec_time_base: '1/60',
//             codec_tag_string: 'avc1',
//             codec_tag: '0x31637661',
//             width: 512,
//             height: 288,
//             coded_width: 512,
//             coded_height: 288,
//             closed_captions: 0,
//             has_b_frames: 2,
//             sample_aspect_ratio: '1:1',
//             display_aspect_ratio: '16:9',
//             pix_fmt: 'yuv420p',
//             level: 41,
//             color_range: 'unknown',
//             color_space: 'unknown',
//             color_transfer: 'unknown',
//             color_primaries: 'unknown',
//             chroma_location: 'left',
//             field_order: 'unknown',
//             timecode: 'N/A',
//             refs: 1,
//             is_avc: 'true',
//             nal_length_size: 4,
//             id: 'N/A',
//             r_frame_rate: '30/1',
//             avg_frame_rate: '30/1',
//             time_base: '1/15360',
//             start_pts: 0,
//             start_time: 0,
//             duration_ts: 46080,
//             duration: 3,
//             bit_rate: 16605,
//             max_bit_rate: 'N/A',
//             bits_per_raw_sample: 8,
//             nb_frames: 90,
//             nb_read_frames: 'N/A',
//             nb_read_packets: 'N/A',
//             tags: [Object],
//             disposition: [Object]
//           },
//           {
//             index: 1,
//             codec_name: 'aac',
//             codec_long_name: 'AAC (Advanced Audio Coding)',
//             profile: 'LC',
//             codec_type: 'audio',
//             codec_time_base: '1/44100',
//             codec_tag_string: 'mp4a',
//             codec_tag: '0x6134706d',
//             sample_fmt: 'fltp',
//             sample_rate: 44100,
//             channels: 2,
//             channel_layout: 'stereo',
//             bits_per_sample: 0,
//             id: 'N/A',
//             r_frame_rate: '0/0',
//             avg_frame_rate: '0/0',
//             time_base: '1/44100',
//             start_pts: 0,
//             start_time: 0,
//             duration_ts: 132300,
//             duration: 3,
//             bit_rate: 13432,
//             max_bit_rate: 224000,
//             bits_per_raw_sample: 'N/A',
//             nb_frames: 131,
//             nb_read_frames: 'N/A',
//             nb_read_packets: 'N/A',
//             tags: [Object],
//             disposition: [Object]
//           }
//         ],
//         format: {
//           filename: '/Users/doug/GitHub/moviemasher.js/dev/shared/video/rgb.mp4',
//           nb_streams: 2,
//           nb_programs: 0,
//           format_name: 'mov,mp4,m4a,3gp,3g2,mj2',
//           format_long_name: 'QuickTime / MOV',
//           start_time: 0,
//           duration: 3.024,
//           size: 15970,
//           bit_rate: 42248,
//           probe_score: 100,
//           tags: {
//             major_brand: 'isom',
//             minor_version: '512',
//             compatible_brands: 'isomiso2avc1mp41',
//             title: 'test',
//             encoder: 'Lavf58.29.100'
//           }
//         },
//         chapters: []
// }
