
import internal from 'stream'
import { Command } from '../Command/Command'
import EventEmitter from 'events'


export type CommandDestination = string | internal.Writable

interface CommandResult {
  error?: string
}

interface RunningCommand extends EventEmitter{
  id: string
  run: (destination: CommandDestination) => void
  runPromise: (destination: CommandDestination) => Promise<CommandResult>
  command: Command
  kill: () => void
}

export {
  CommandResult,
  RunningCommand,
}
