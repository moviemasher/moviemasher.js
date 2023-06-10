import { RawProbeData } from "@moviemasher/lib-shared"

import EventEmitter from "events"
import { CommandDestination } from "../RunningCommand/RunningCommand.js"


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
