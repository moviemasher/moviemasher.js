import type { Identified, StringDataOrError, Strings } from '@moviemasher/runtime-shared'
import type { Command } from './Command/Command.js'

export interface CommandResult {
  error?: string
}

export interface RunningCommand extends Identified {
  commandArguments: Strings
  runPromise(destination: string): Promise<StringDataOrError>
  command: Command
  commandString(destination: string): string
  graphString: string
  kill(): void
}
