import type { Writable } from 'stream'
import type { Identified } from '@moviemasher/lib-core'

import type { Command } from '../Command/Command.js'

export type CommandDestination = string | Writable

export interface CommandResult {
  error?: string
}

export interface RunningCommand extends Identified {
  runPromise(destination: CommandDestination): Promise<CommandResult>
  command: Command
  kill(): void
}
