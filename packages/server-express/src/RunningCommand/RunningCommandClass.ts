import path from "path"
import fs from 'fs'
import EventEmitter from "events"
import {
  CommandOptions, CommandOutput, CommandInputs, GraphFilters, Errors, CommandFilters, AVType, isString, assertPopulatedString, isPopulatedString, assertPopulatedArray
} from "@moviemasher/moviemasher.js"

import { Command } from "../Command/Command"
import { commandInstance } from "../Command/CommandFactory"
import { RunningCommand, CommandDestination, CommandResult } from "./RunningCommand"
import { commandArgsString } from "../Utilities/Command"

export class RunningCommandClass extends EventEmitter implements RunningCommand {
  constructor(id: string, args: CommandOptions) {
    super()
    this.id = id
    const { commandFilters, inputs, output, avType } = args
    this.avType = avType
    if (commandFilters) this.commandFilters = commandFilters
    if (inputs) this.commandInputs = inputs
    if (!(this.commandInputs.length || this.commandFilters.length)) {
      console.trace(this.constructor.name, "with no inputs or commandFilters")
      throw Errors.invalid.argument + 'inputs'
    }
    this.output = output
  }

  private _commandProcess?: Command
  get command(): Command {
    if (this._commandProcess) return this._commandProcess

    const { commandInputs: inputs, commandFilters, output, avType } = this
    console.log(this.constructor.name, "command", inputs)
    const commandOptions: CommandOptions = { commandFilters, inputs, output, avType }
    return this._commandProcess = commandInstance(commandOptions)
  }

  avType: AVType

  commandFilters: CommandFilters = []

  id: string

  commandInputs: CommandInputs = []

  kill() {
    console.debug(this.constructor.name, "kill", this.id)
    this._commandProcess?.kill('SIGKILL')
  }

  makeDirectory(destination: string): void {
    fs.mkdirSync(path.dirname(destination), { recursive: true })
  }

  output: CommandOutput = {}

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
