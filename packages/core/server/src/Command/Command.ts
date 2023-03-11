import { RawProbeData } from "@moviemasher/moviemasher.js"

import EventEmitter from "events"
import { CommandDestination } from "../RunningCommand/RunningCommand"


export interface CommandProbeFunction {
  (error: any, data: RawProbeData): void
}

export interface Command extends EventEmitter {
  run(): void
  output(destination: CommandDestination): Command
  save(output: string): Command
  mergeAdd(file: string): Command
  mergeToFile(destination: CommandDestination, tmpFolder: string): Command

  kill(signal: string): void
  ffprobe(callback: CommandProbeFunction): void
  _getArguments(): string[]
}
