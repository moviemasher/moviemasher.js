import type { RawProbeData } from '@moviemasher/shared-lib/types.js'
import type { EventEmitter } from 'events'

export interface CommandProbeFunction {
  (error: any, data: RawProbeData): void
}

export interface Command extends EventEmitter {
  _getArguments(): string[]
  ffprobe(callback: CommandProbeFunction): void
  kill(signal: string): void
  mergeAdd(file: string): Command
  mergeToFile(destination: string, tmpFolder: string): Command
  output(destination: string): Command
  run(): void
  save(output: string): Command
}
