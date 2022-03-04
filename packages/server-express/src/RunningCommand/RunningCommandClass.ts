import path from "path"
import fs from 'fs'
import EventEmitter from "events"
import {
  CommandArgs, CommandOutput, CommandInputs, GraphFilters
} from "@moviemasher/moviemasher.js"

import { Command } from "../Command/Command"
import { commandInstance } from "../Command/CommandFactory"
import {
  RunningCommand, CommandDestination, CommandResult
} from "./RunningCommand"

class RunningCommandClass extends EventEmitter implements RunningCommand {
  constructor(id: string, args: CommandArgs) {
    super()
    this.id = id
    this.graphFilters = args.graphFilters
    this.commandInputs = args.inputs
    this.output = args.output
  }

  private _commandProcess?: Command
  get command(): Command {
    if (this._commandProcess) return this._commandProcess

    return this._commandProcess = commandInstance({
      inputs: this.commandInputs,
      output: this.output,
      graphFilters: this.graphFilters
    })
  }

  graphFilters: GraphFilters = []

  destination: CommandDestination = ''

  id: string

  commandInputs: CommandInputs = []

  kill() {
    console.log(this.constructor.name, "kill", this.id)
    this._commandProcess?.kill('SIGKILL')
  }

  output: CommandOutput = {} //outputDefaultHls()

  run(destination: CommandDestination): void {
    // console.log(this.constructor.name, "run")

    this.command.on('error', (...args: any[]) => {
      // console.log(this.constructor.name, "run received error", this.runError(...args))
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
      fs.mkdirSync(path.dirname(destination), { recursive: true })
    }
    try {
      this.command.run()
    } catch (error) {
      console.log(this.constructor.name, "run received error", error)
    }
  }

  runError(...args: any[]): string {
    return [...this.command._getArguments(), ...args].join("\n")
  }

  async runPromise(destination: CommandDestination): Promise<CommandResult> {
    // console.log(this.constructor.name, "runPromise", destination)
    const promise = new Promise<CommandResult>(resolve => {
      this.command.on('error', (...args: any[]) => {
        console.log(this.constructor.name, "runPromise received error event")
        resolve({ error: this.runError(...args) })
      })
      this.command.on('end', () => {
        // console.log(this.constructor.name, "runPromise received end event")

        const result: CommandResult = {}
        resolve(result)
      })
      try {
        if (typeof destination === 'string') {
          // const dir = path.dirname(destination)
          // fs.mkdir(dir, { recursive: true }, () => {
            // console.log(this.constructor.name, "runPromise calling save", destination)
            this.command.save(destination)
          // })
        } else console.log(this.constructor.name, "runPromise destination not string", destination)
      }
      catch (error) {
        console.error(this.constructor.name, "runPromise resolving during catch")
        resolve({ error: this.runError(error) })
      }
    })
    return promise
  }
}

export { RunningCommandClass }
