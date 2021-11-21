import ffmpeg from 'fluent-ffmpeg'
import internal from 'stream'
import { Default } from '@moviemasher/moviemasher.js'

ffmpeg.setFfmpegPath('ffmpeg')

type CommandValue = string | number
type CommandOptions = string[] | Record<string, CommandValue>
type CommandDestination = string | internal.Writable
interface CommandInputOptions {
  source: string | internal.Readable
  options?: CommandOptions
}

interface CommandOutputOptions {
  options?: CommandOptions
  audioCodec?: string
  audioBitrate?: string | number
  audioChannels?: number
  audioFrequency?: number
  videoCodec?: string
  size?: string
  fps?: number
  format?: string
}
type CommandOutputOverrides = Partial<CommandOutputOptions>

interface CommandArgs {
  inputs?: CommandInputOptions[]
  output: CommandOutputOptions
  destination: CommandDestination
}

class Command {
  constructor(options?: CommandArgs) {
    if (options) {
      if (options.inputs) this.inputs.push(...options.inputs)
      if (options.output) this.output = options.output
      if (options.destination) this.destination = options.destination
    }

    this.inputs.forEach(({source, options}) => {
      this.proc.addInput(source)

      if (options) this.proc.addInputOptions(Command.options(options))
    })
    const { output, destination } = this
    if (output.options) this.proc.addOutputOptions(Command.options(output.options))

    if (output.audioCodec) this.proc.audioCodec(output.audioCodec)
    if (output.audioBitrate) this.proc.audioBitrate(output.audioBitrate)
    if (output.audioChannels) this.proc.audioChannels(output.audioChannels)
    if (output.audioFrequency) this.proc.audioFrequency(output.audioFrequency)
    if (output.videoCodec) this.proc.videoCodec(output.videoCodec)
    if (output.size) this.proc.size(output.size)
    if (output.fps) this.proc.fpsOutput(output.fps)
    if (output.format) this.proc.format(output.format)
    this.proc.output(destination)

    this.proc.on('start', () => { console.log('Start command', destination) })
    this.proc.on('end', () => {
      console.log('Stop command', destination)
    })

  }
  destination: CommandDestination = ''

  inputs: CommandInputOptions[] = []


  output: CommandOutputOptions = Command.outputHls()

  private proc = ffmpeg()

  run(): void { this.proc.run() }

  static commands: Command[] = []

  static create(options?: CommandArgs): Command {
    const command = new Command(options)
    this.commands.push(command)
    return command
  }

  static options(args: CommandOptions): string[] {
    if (Array.isArray(args)) return args

    return Object.entries(args).map(([key, value]) => `-${key} ${value}`)
  }

  static optionsObject(args: CommandOptions): Record<string, CommandValue> {
    if (!Array.isArray(args)) return args

    return Object.fromEntries(args.map(string => {
      const delimiter = [' ', '='].find(char => string.includes(char))
      const bits = delimiter ? string.split(delimiter) : [string]
      const [key, value] = bits
      const keyWithoutDashes = key.replace(/^[-]+/, '')
      return [keyWithoutDashes, value || '']
    }))
  }

  static optionsFlags(args: CommandOptions): string {
    const record = this.optionsObject(args)
    const bits = Object.entries(record).map(([key, value]) => `${key}=${value}`)
    return `[${bits.join(':')}]`
  }

  static outputFlv(overrides?: CommandOutputOverrides): CommandOutputOptions {
    const { size, ...rest } = (overrides || {})
    const sureSize = size || Default.mash.output.size

    return {
      format: 'flv',
      audioCodec: 'aac',
      audioBitrate: '128k',
      audioChannels: 2,
      audioFrequency: 44100,
      videoCodec: 'libx264',
      size: sureSize,
      fps: 30,
      ...rest
    }
  }

  static outputHls(overrides?: CommandOutputOverrides): CommandOutputOptions {
    const { size, ...rest } = (overrides || {})
    const sureSize = size || Default.mash.output.size
    return {
      format: 'hls',
      options: {
        crf: '21',
        maxrate: '1M',
        bufsize: '2M',
        preset: 'veryslow',
        keyint_min: '100',
        g: '100',
        sc_threshold: '0',
        hls_playlist_type: 'event',
        hls_segment_filename: `${sureSize}-%06d.ts`,
        hls_time: '4',
      },
      audioCodec: 'aac',
      audioBitrate: '128k',
      audioChannels: 2,
      audioFrequency: 44100,
      videoCodec: 'libx264',
      size: sureSize,
      fps: 30,
      ...rest,
    }
  }
  static outputRtmp(overrides?: CommandOutputOverrides): CommandOutputOptions {
    // IVS suggests, but it currently fails:
    // '-profile:v main', '-preset veryfast', '-x264opts "nal-hrd=cbr:no-scenecut"',
    // '-minrate 3000', '-maxrate 3000', '-g 60'
    return this.outputFlv(overrides)
  }
}

export { Command, CommandArgs, CommandInputOptions, CommandOutputOptions }
