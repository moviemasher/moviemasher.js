import type { Identified, StringDataOrError, Strings } from '@moviemasher/shared-lib/types.js'
import type { Command } from '../type/Command.js'

export interface CommandResult {
  error?: string
}

export interface RunningCommand extends Identified {
  commandArguments: Strings
  runPromise(destination: string): Promise<StringDataOrError>
  command: Command
  commandString(destination: string): string
  kill(): void
}
