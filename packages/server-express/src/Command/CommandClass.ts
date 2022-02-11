import path from "path"
import fs from 'fs'
import EventEmitter from "events"
import {
  GraphFilter, outputDefaultHls, OutputOptions
} from "@moviemasher/moviemasher.js"

import { CommandProcess } from "../CommandProcess/CommandProcess"
import { CommandProcessFactory } from "../CommandProcess/CommandProcessFactory"
import {
  Command, CommandDestination, CommandInput, CommandOptions, CommandResult
} from "./Command"

class CommandClass extends EventEmitter implements Command {
  constructor(id: string, options?: CommandOptions) {
    super()
    this.id = id
    if (options) {
      if (options.inputs) this.inputs = options.inputs
      if (options.output) this.output = options.output
      if (options.destination) this.destination = options.destination
      if (options.complexFilter) this.complexFilter = options.complexFilter
    }
  }

  destination: CommandDestination = ''

  id: string

  inputs: CommandInput[] = []

  complexFilter: GraphFilter[] = []

  output: OutputOptions = outputDefaultHls()

  _commandProcess?: CommandProcess

  get commandProcess(): CommandProcess {
    if (this._commandProcess) return this._commandProcess

    return this._commandProcess = CommandProcessFactory.instance({
      inputs: this.inputs,
      output: this.output,
      destination: this.destination,
      complexFilter: this.complexFilter
    })
  }

  kill() {
    console.log(this.constructor.name, "kill", this.id)
    this._commandProcess?.kill('SIGKILL')
  }

  run(): void {
    this.commandProcess.on('error', (...args: any[]) => {
      this.emit('error', this.runError(...args))
    })
    this.commandProcess.on('start', (...args: any[]) => {
      this.emit('start', ...args)
    })
    this.commandProcess.on('end', (...args: any[]) => {
      this.emit('end', ...args)
    })
    const { destination } = this
    if (typeof destination === 'string') {
      console.log(this.constructor.name, "run", destination)
      fs.mkdirSync(path.dirname(destination), { recursive: true })
    }
    this.commandProcess.run()
  }

  async runPromise(): Promise<CommandResult> {
    const promise = new Promise<CommandResult>(resolve => {
      this.commandProcess.on('error', (...args: any[]) => {
        // console.error(this.constructor.name, "runPromise rejecting during error event")
        resolve({ error: this.runError(...args) })
      })
      this.commandProcess.on('end', () => {
        const result: CommandResult = {}
        resolve(result)
      })
      try {
        const { destination } = this
        if (typeof destination === 'string') {
          const dir = path.dirname(path.resolve(destination))
          // console.log(this.constructor.name, "runCommand", dir)
          fs.mkdir(dir, { recursive: true }, () => {
            // const result: CommandResult = {}
            // resolve(result)
            // console.log(this.runError('RUN'))
            this.commandProcess.run()
          })
        }
      }
      catch (error) {
        // console.error(this.constructor.name, "runPromise rejecting during catch")
        resolve({ error: this.runError(error) })
      }
    })
    return promise
  }

  runError(...args: any[]): string {
    return [...this.commandProcess._getArguments(), ...args].join("\n")
  }
}

export { CommandClass }
