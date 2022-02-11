
import ffmpeg from 'fluent-ffmpeg'

import internal from 'stream'
import {
  GraphFilter, ValueObject, OutputOptions
} from '@moviemasher/moviemasher.js'
import { CommandProcess } from '../CommandProcess/CommandProcess'
import EventEmitter from 'events'

interface CommandInstance extends ffmpeg.FfmpegCommand {}

type CommandDestination = string | internal.Writable
type CommandSource = string | internal.Readable

interface CommandInput {
  source: CommandSource
  options?: ValueObject
}

interface CommandOptions {
  inputs?: CommandInput[]
  output?: OutputOptions
  destination?: CommandDestination
  complexFilter?: GraphFilter[]
}

interface CommandResult {
  error?: string
}

type CommandPromise = Promise<CommandResult>

interface CommandArgs extends Required<CommandOptions> {}


const commandInputOptions = (args: ValueObject): string[] => Object.entries(args).map(
  ([key, value]) => {
    const keyString = `-${key}`
    const valueString = String(value)
    if (valueString.length) return `${keyString} ${valueString}`
    return keyString
  }
)

interface Command extends EventEmitter{
  id: string
  run: () => void
  runPromise: () => CommandPromise
  commandProcess: CommandProcess
  kill: () => void
}

export {
  CommandResult,
  CommandArgs,
  CommandDestination,
  CommandInput,
  commandInputOptions,
  CommandInstance,
  CommandOptions,
  CommandPromise,
  CommandSource,
  Command,
}
