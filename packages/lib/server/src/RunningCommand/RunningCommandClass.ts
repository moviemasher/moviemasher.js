import type { Command } from './Command/Command.js'
import type { CommandOptions } from '../encode/Encode.js'
import type { CommandDestination, RunningCommand } from './RunningCommand.js'

import { assertPopulatedString } from '@moviemasher/lib-shared'
import { ERROR, StringDataOrError, Strings, errorThrow } from '@moviemasher/runtime-shared'
import path from 'path'
import { commandInstance } from './Command/CommandFactory.js'
import { commandString, commandError } from '../Utility/Command.js'
import { directoryCreate } from '../Utility/File.js'

export class RunningCommandClass implements RunningCommand {
  constructor(public id: string, public commandOptions: CommandOptions) {
    if (!(this.commandInputs.length || this.commandFilters.length)) {
      console.trace(this.constructor.name, 'with no inputs or commandFilters')
      return errorThrow(ERROR.Internal) 
    }
  }

  get commandArguments(): Strings { return this.command._getArguments() }

  private _command?: Command
  
  get command(): Command {
    return this._command ||= commandInstance(this.commandOptions)
  }

  private get commandFilters() { return this.commandOptions.commandFilters || [] }

  private get commandInputs() { return this.commandOptions.inputs || [] }

  commandString(destination: string): string {
    return commandString(this.commandArguments, destination)
  }

  kill() { this._command?.kill('SIGKILL') }

  get output() { return this.commandOptions.commandFilters || [] }

  runPromise(destination: CommandDestination): Promise<StringDataOrError> {
    assertPopulatedString(destination)
  
    const promise = new Promise<StringDataOrError>(resolve => {
      const { command } = this
      command.on('error', (error, stdout, stderr) => {
        // console.error(this.constructor.name, 'runPromise ON ERROR', {error, stdout, stderr})
        resolve({ error: commandError(this.commandArguments, destination, error, stderr, stdout)})
      })
      command.on('end', () => { resolve({ data: destination }) })
      try {

        directoryCreate(path.dirname(destination))
        command.save(destination)
      }
      catch (error) {
        // console.error(this.constructor.name, 'runPromise CAUGHT', error)
        resolve({ error: commandError(this.commandArguments, destination, error) })
      }
    })
    return promise
  }
}
