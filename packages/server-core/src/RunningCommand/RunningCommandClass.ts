import path from "path"
import fs from 'fs'
import EventEmitter from "events"

import {
  assertPopulatedString, isPopulatedString, errorThrow, ErrorName
} from "@moviemasher/moviemasher.js"

import { commandArgsString } from "../Utility/Command"
import { Command } from "../Command/Command"
import { commandInstance } from "../Command/CommandFactory"
import { RunningCommand, CommandDestination, CommandResult } from "./RunningCommand"
import { CommandOptions } from "../Encode/Encode"

export class RunningCommandClass extends EventEmitter implements RunningCommand {
  constructor(id: string, args: CommandOptions) {
    super()
    this.id = id
    this.commandOptions = args

    if (!(this.commandInputs.length || this.commandFilters.length)) {
      console.trace(this.constructor.name, "with no inputs or commandFilters")
      return errorThrow(ErrorName.Internal) 
    }
  }

  private _command?: Command
  get command(): Command {
    return this._command ||= commandInstance(this.commandOptions)
  }

  get avType() { return this.commandOptions.avType }

  get commandFilters() { return this.commandOptions.commandFilters || [] }

  id: string

  get commandInputs() { return this.commandOptions.inputs || [] }

  commandOptions: CommandOptions

  kill() {
    console.debug(this.constructor.name, "kill", this.id)
    this._command?.kill('SIGKILL')
  }

  makeDirectory(destination: string): void {
    fs.mkdirSync(path.dirname(destination), { recursive: true })
  }

  get output() { return this.commandOptions.commandFilters || [] }

  run(destination: CommandDestination): void {
    // console.log(this.constructor.name, "run", destination)

    this.command.on('error', (...args: any[]) => {
      const destinationString = isPopulatedString(destination) ? destination : ''
      const errorString = this.runError(destinationString, ...args)
      console.error(this.constructor.name, "run on error", errorString)
      this.emit('error', errorString)
    })
    this.command.on('start', (...args: any[]) => {
      this.emit('start', ...args)
    })
    this.command.on('end', (...args: any[]) => {
      this.emit('end', ...args)
    })
    if (isPopulatedString(destination)) this.makeDirectory(destination)

    try {
      this.command.output(destination)
      this.command.run()
    } catch (error) {
      console.error(this.constructor.name, "run received error", error)
    }
  }

  runError(destination: string, ...args: any[]): string {
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
        this.makeDirectory(destination)
        command.save(destination)
      }
      catch (error) {
        reject({ error: this.runError(destination, error) })
      }
    })
    return promise
  }
}
