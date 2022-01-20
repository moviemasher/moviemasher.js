import path from "path"
import fs from 'fs'
import EventEmitter from "events"
import { GraphFilter, outputHls, OutputObject } from "@moviemasher/moviemasher.js"

import { CommandProcess } from "../CommandProcess/CommandProcess"
import { CommandProcessFactory } from "../CommandProcess/CommandProcessFactory"
import { Command, CommandDestination, CommandInput, CommandOptions } from "./Command"

class CommandClass extends EventEmitter implements Command {
  constructor(id: string, options?: CommandOptions) {
    super()
    this.id = id
    if (options) {

      if (options.inputs) this.inputs = options.inputs
      if (options.output) this.output = options.output
      if (options.destination) this.destination = options.destination
      if (options.complexFilter) this.complexFilter = options.complexFilter

      const prefix = '../../dev/workspaces/example-client-react'
      if (!this.inputs.length) {
        console.log(this.constructor.name, "with no inputs", this.inputs)

        const input: CommandInput = {
          source: './dist/img/c.png',
          options: { r: this.output.fps, loop: 1 }
        }
        this.inputs.push(input)
      }

      this.inputs.forEach(input => {
        const { source } = input
        if (!source) throw 'no source'

        if (typeof source === 'string') {
          const absolute = source.startsWith('http')
          const localPath = absolute ? source : path.resolve(prefix, source)
          const exists = absolute || fs.existsSync(localPath)
          if (!exists) {
            console.error(this.constructor.name, "update could not find", source)
            throw `NOT FOUND ${localPath}`
          }
          console.log(this.constructor.name, "update found", localPath)
          input.source = localPath
        }

      })

      // const { layers } = segment

      // const commandInputs: CommandInput[] = []
      // const complexFilter = layers.flatMap((layer, track) => {
      //   const { merger, filters, inputs } = layer
      //   if (!inputs) console.log(this.constructor.name, "update layer with no inputs", layer)

          // commandInputs.push(commandInput)
      //   })

      //   const array = filters
      //   if (merger) array.push(merger)
      //   return array
      // })

      // if (!commandInputs.length) {
      //   console.log(this.constructor.name, "update with no commandInputs", commandInputs)

      //   const input: CommandInput = {
      //     source: './dist/img/c.png',
      //     options: { r: fps, loop: 1 }
      //   }
      //   commandInputs.push(input)
      // }

      // const options: CommandArgs = {
      //   inputs: commandInputs,
      //   complexFilter,
      //   output: outputObject,
      //   destination
      // }
    }
  }

  destination: CommandDestination = ''

  id: string

  inputs: CommandInput[] = []

  complexFilter: GraphFilter[] = []

  output: OutputObject = outputHls()

  _commandProcess?: CommandProcess

  get commandProcess(): CommandProcess {
    if (this._commandProcess) return this._commandProcess

    return this._commandProcess = CommandProcessFactory.instance({
      inputs: this.inputs,
      output: this.output,
      destination: this.destination,
      complexFilter: this.complexFilter,
    })
  }

  kill() {
    this._commandProcess?.kill('SIGKILL')
  }

  run(): void {
    this.commandProcess.on('error', (...args: any[]) => {
      this.emit('error', [...this.commandProcess._getArguments(), ...args].join("\n"))
    })
    this.commandProcess.on('start', (...args: any[]) => {
      this.emit('start', ...args)
    })
    this.commandProcess.on('end', (...args: any[]) => {
      this.emit('end', ...args)
    })
    this.commandProcess.run()
  }
 }

export { CommandClass }
