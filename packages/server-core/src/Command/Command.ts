import { CommandProbeData } from "@moviemasher/moviemasher.js"

import EventEmitter from "events"
import { CommandDestination } from "../RunningCommand/RunningCommand"


export interface CommandProbeFunction {
  (error: any, data: CommandProbeData): void
}

export interface Command extends EventEmitter {
  run(): void
  output(destination: CommandDestination): Command
  save(output: string): Command
  mergeAdd(file: string): Command
  mergeToFile(destination: CommandDestination): Command

  kill(signal: string): void
  ffprobe(callback: CommandProbeFunction): void
  _getArguments(): string[]
}
