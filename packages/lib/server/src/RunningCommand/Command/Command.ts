import type { RawProbeData } from '@moviemasher/lib-shared'
import type { CommandDestination } from '../RunningCommand.js'

import type { EventEmitter } from 'events'

export interface CommandProbeFunction {
  (error: any, data: RawProbeData): void
}

export interface Command extends EventEmitter {
  _getArguments(): string[]
  ffprobe(callback: CommandProbeFunction): void
  kill(signal: string): void
  mergeAdd(file: string): Command
  mergeToFile(destination: CommandDestination, tmpFolder: string): Command
  output(destination: CommandDestination): Command
  run(): void
  save(output: string): Command
}
