import type { Command } from './Command/Command.js'
import type { CommandOptions } from '../encode/Encode.js'
import type { CommandDestination, CommandResult, RunningCommand } from './RunningCommand.js'

import { assertPopulatedString } from '@moviemasher/lib-shared'
import { ERROR, errorThrow } from '@moviemasher/runtime-shared'
import fs from 'fs'
import path from 'path'
import { commandInstance } from './Command/CommandFactory.js'
import { commandArgsString } from '../Utility/Command.js'

export class RunningCommandClass implements RunningCommand {
  constructor(public id: string, public commandOptions: CommandOptions) {
    if (!(this.commandInputs.length || this.commandFilters.length)) {
      console.trace(this.constructor.name, 'with no inputs or commandFilters')
      return errorThrow(ERROR.Internal) 
    }
  }

  private _command?: Command
  get command(): Command {
    return this._command ||= commandInstance(this.commandOptions)
  }

  private get commandFilters() { return this.commandOptions.commandFilters || [] }

  private get commandInputs() { return this.commandOptions.inputs || [] }

  kill() {
    console.debug(this.constructor.name, 'kill', this.id)
    this._command?.kill('SIGKILL')
  }

  get output() { return this.commandOptions.commandFilters || [] }

  private runError(destination: string, ...args: any[]): string {
    return commandArgsString(this.command._getArguments(), destination, ...args) 
  }

  runPromise(destination: CommandDestination): Promise<CommandResult> {
    assertPopulatedString(destination)

    const result: CommandResult = {}
    const promise = new Promise<CommandResult>((resolve, reject) => {
      const { command } = this
      command.on('error', (...args: any[]) => {
        reject({ error: this.runError(destination, ...args)})
      })
      command.on('end', () => { resolve(result) })
      try {
        fs.mkdirSync(path.dirname(destination), { recursive: true })
        command.save(destination)
      }
      catch (error) {
        reject({ error: this.runError(destination, error) })
      }
    })
    return promise
  }
}
