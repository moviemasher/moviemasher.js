import internal from 'stream'
import EventEmitter from 'events'

import { Command } from '../Command/Command'

export type CommandDestination = string | internal.Writable

export interface CommandResult {
  error?: string
}

export interface RunningCommand extends EventEmitter{
  id: string
  run(destination: CommandDestination): void
  runPromise(destination: CommandDestination): Promise<CommandResult>
  command: Command
  kill(): void
}
