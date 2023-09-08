import type { Identified } from '@moviemasher/runtime-shared'
import type { Command } from './Command/Command.js'

export type CommandDestination = string 

export interface CommandResult {
  error?: string
}

export interface RunningCommand extends Identified {
  runPromise(destination: CommandDestination): Promise<CommandResult>
  command: Command
  kill(): void
}
