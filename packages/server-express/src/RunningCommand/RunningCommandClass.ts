import path from "path"
import fs from 'fs'
import EventEmitter from "events"
import {
  CommandOptions, CommandOutput, CommandInputs, GraphFilters, Errors, CommandFilters, AVType
} from "@moviemasher/moviemasher.js"

import { Command } from "../Command/Command"
import { commandInstance } from "../Command/CommandFactory"
import { RunningCommand, CommandDestination, CommandResult } from "./RunningCommand"

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
      console.error(this.constructor.name, "run received error", this.runError(...args))
      this.emit('error', this.runError(...args))
    })
    this.command.on('start', (...args: any[]) => {
      this.emit('start', ...args)
    })
    this.command.on('end', (...args: any[]) => {
      this.emit('end', ...args)
    })
    if (typeof destination === 'string') {
      // console.log(this.constructor.name, "run", destination)
      this.makeDirectory(destination)

    }
    try {
      this.command.output(destination)
      this.command.run()
    } catch (error) {
      console.error(this.constructor.name, "run received error", error)
    }
  }

  runError(...args: any[]): string {
    return [...this.command._getArguments(), ...args].join("\n")
  }

  async runPromise(destination: CommandDestination): Promise<CommandResult> {
    // console.log(this.constructor.name, "runPromise", destination)
    const promise = new Promise<CommandResult>(resolve => {
      this.command.on('error', (...args: any[]) => {
        const error = this.runError(...args)
        console.error(this.constructor.name, "runPromise received error event", error)
        resolve({ error })
      })
      this.command.on('end', () => {
        // console.log(this.constructor.name, "runPromise received end event", this.command._getArguments())

        const result: CommandResult = {}
        resolve(result)
      })
      try {
        if (typeof destination === 'string') {
          this.makeDirectory(destination)

          // console.log(this.constructor.name, "runPromise calling save")

          this.command.save(destination)
        }
        else console.log(this.constructor.name, "runPromise destination not string", destination)
      }
      catch (error) {
        console.error(this.constructor.name, "runPromise resolving during catch")
        resolve({ error: this.runError(error) })
      }
    })
    return promise
  }
}
