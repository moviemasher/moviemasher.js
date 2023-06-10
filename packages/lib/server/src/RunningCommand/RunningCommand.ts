import type { Writable } from 'stream'

import type { Command } from '../Command/Command.js'
import { Identified } from '@moviemasher/runtime-shared'

export type CommandDestination = string | Writable

export interface CommandResult {
  error?: string
}

export interface RunningCommand extends Identified {
  runPromise(destination: CommandDestination): Promise<CommandResult>
  command: Command
  kill(): void
}
