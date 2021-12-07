import ffmpeg, { FilterSpecification } from 'fluent-ffmpeg'
import {
  Default, OutputFormat, ValueObject, Options, OutputOptions
} from '@moviemasher/moviemasher.js'

import { CommandArgs, CommandDestination, CommandInputOptions } from '../declaration'
import path from 'path'

ffmpeg.setFfmpegPath('ffmpeg')

const CommandSegmentPadding = 6


class Command {
  constructor(args?: CommandArgs) {
    if (args) {
      if (args.inputs) this.inputs = args.inputs
      if (args.output) this.output = args.output
      if (args.destination) this.destination = args.destination
      if (args.complexFilter) this.complexFilter = args.complexFilter
    }

    this.inputs.forEach(({source, options}) => {
      this.proc.addInput(source)
      this.proc.addInputOption('-re')
      if (options) this.proc.addInputOptions(Command.options(options))
    })

    if (this.complexFilter.length) {
      // this.proc.addInputOptions(['-loop 1'])
      this.proc.complexFilter(this.complexFilter)
    }

    const { output, destination } = this

    const options: Options = output.options || {}

    if (output.audioCodec) this.proc.audioCodec(output.audioCodec)
    if (output.audioBitrate) this.proc.audioBitrate(output.audioBitrate)
    if (output.audioChannels) this.proc.audioChannels(output.audioChannels)
    if (output.audioFrequency) this.proc.audioFrequency(output.audioFrequency)
    if (output.videoCodec) this.proc.videoCodec(output.videoCodec)
    if (output.width && output.height) this.proc.size(`${output.width}x${output.height}`)
    if (output.fps) this.proc.fpsOutput(output.fps)
    if (output.format) {
      this.proc.format(output.format)
      switch (output.format) {
        case 'hls':
          if (Array.isArray(options) || (typeof destination !== 'string')) break

          const { hls_segment_filename: filename } = options
          if (typeof filename !== 'string') break

          if (filename.includes('/')) break

          options.hls_segment_filename = `${path.dirname(destination)}/${filename}`
          break
        default:
          break
      }
    }
    if (output.options) this.proc.addOutputOptions(Command.options(options))

    this.proc.output(destination)

    this.proc.on('start', (cmd:string) => { console.log('Start command', cmd) })
    this.proc.on('end', () => {
      console.log('Stop command', destination)
    })

  }
  destination: CommandDestination = ''

  inputs: CommandInputOptions[] = []

  complexFilter: FilterSpecification[] = []

  output: OutputOptions = Command.outputHls()

  private proc = ffmpeg()

  run(): void { this.proc.run() }

  static commands: Record<string, Command> = {}

  static create(id: string, options?: CommandArgs): Command {
    const command = new Command(options)
    this.commands[id] = command
    return command
  }

  static get(id: string): Command | undefined { return this.commands[id] }

  static delete(id: string): void {
    const existing = this.get(id)
    if (!existing) return

    existing.proc.kill('SIGKILL')
    delete this.commands[id]
  }
  static options(args: Options): string[] {
    if (Array.isArray(args)) return args

    return Object.entries(args).map(([key, value]) => `-${key} ${value}`)
  }

  static optionsObject(args: Options): ValueObject {
    if (!Array.isArray(args)) return args

    return Object.fromEntries(args.map(string => {
      const delimiter = [' ', '='].find(char => string.includes(char))
      const bits = delimiter ? string.split(delimiter) : [string]
      const [key, value] = bits
      const keyWithoutDashes = key.replace(/^[-]+/, '')
      return [keyWithoutDashes, value || '']
    }))
  }

  static optionsFlags(args: Options): string {
    const record = this.optionsObject(args)
    const bits = Object.entries(record).map(([key, value]) => `${key}=${value}`)
    return `[${bits.join(':')}]`
  }

  static outputFlv(overrides?: OutputOptions): OutputOptions {
    const object = overrides || {}
    const baseOptions = { ...object, format: 'flv' }
    const outputOptions = this.optionsOutput(baseOptions)

    return outputOptions
  }

  static optionsOutput(overrides?: OutputOptions): OutputOptions {
    const object = overrides || {}
    return {
      ...Default.mash.output,
      ...object,
    }
  }


  static outputHls(overrides?: OutputOptions): OutputOptions {
    const object = overrides || {}
    const baseOptions = { ...object, format: 'hls' }
    const outputOptions = this.optionsOutput(baseOptions)

    const { fps = Default.mash.output.fps } = outputOptions
    const { options = {} } = outputOptions

    return {
      ...outputOptions,
      options: {
        // crf: '21',
        // maxrate: '1M',
        // bufsize: '2M',
        // preset: 'veryslow',
        // keyint_min: '100',
        // sc_threshold: '0',
        // hls_playlist_type: 'event',
        hls_segment_filename: `%0${CommandSegmentPadding}d.ts`,
        // hls_time: '4',

        hls_time: 6,
        hls_list_size: 10,
        hls_flags: 'delete_segments',
        g: fps * 2, // key frame every two seconds
        ...options
      },
    }
  }

  static outputOptions(format?: string): OutputOptions {
    switch (format) {
      case OutputFormat.Hls: return this.outputHls()
      case OutputFormat.Flv: return this.outputFlv()
      case OutputFormat.Rtmp: return this.outputRtmp()
      default: return this.optionsOutput({ format })
    }
  }
  static outputRtmp(overrides?: OutputOptions): OutputOptions {
    // IVS suggests, but it currently fails:
    // '-profile:v main', '-preset veryfast', '-x264opts "nal-hrd=cbr:no-scenecut"',
    // '-minrate 3000', '-maxrate 3000', '-g 60'
    const flvOverides = this.outputFlv(overrides)

    return flvOverides
  }
}

export { Command, CommandArgs, CommandInputOptions, OutputOptions }
