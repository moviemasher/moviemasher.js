
import fs from 'fs'
import EventEmitter from 'events'
import path from 'path'
import { PassThrough } from 'stream'
import {
  outputHls, Errors, GraphFilter, Segment, UnknownObject, OutputObject, WithError,
  Layer, GraphInput, segmentToCommandOptions
} from '@moviemasher/moviemasher.js'

import { StreamOutput } from '../UnixStream/SocketStreams'
import { Command, CommandArgs, CommandInput, CommandOptions } from '../Command/Command'
import { CommandFactory } from '../Command/CommandFactory'

interface StreamConnectionCommand {
  command: Command
  destination: string
}

class EncodeConnection extends EventEmitter {
  constructor(id: string, outputPrefix?: string, outputObject?: OutputObject) {
    super()
    this.id = id
    this.state = 'open'
    if (outputObject) this.outputObject = outputObject
    if (outputPrefix) this.outputPrefix = outputPrefix
    this.outputObject.width ||= 0
    this.outputObject.height ||= 0
  }

  close(): void {
    this.state = 'closed'
    this.emit('closed')
  }

  defaultSegment(outputObject: OutputObject): Segment {
    const { width, height, fps } = outputObject

    const source = './dist/favicon.ico'
    const colorFilter: GraphFilter = {
      filter: 'color',
      options: { color: '#000000', size: `${width}x${height}`, rate: fps },
      outputs: ['COLOR']
    }
    const filters: GraphFilter[] = [colorFilter]
    const options = {
      x: 'floor((main_w - overlay_w) / 2)',
      y: 'floor((main_h - overlay_h) / 2)'
    }
    const merger: GraphFilter = { options, filter: 'overlay', inputs: ['COLOR', '0:v']}
    const input: GraphInput = { source, options: { loop: 1 } }

    const layer: Layer = { filters, merger, inputs: [input] }
    const layers: Layer[] = [layer]
    const segment: Segment = { layers }
    return segment
  }

  get destination(): string {
    const { outputObject, pathPrefix } = this
    switch (outputObject.format) {
      case 'hls': return `${pathPrefix}/index.m3u8`
      case 'flv': return `${pathPrefix}/index.flv`
      case 'rtmp': return 'rtmps://...'
      case 'pipe': return StreamOutput(new PassThrough(), this.id).url
      default: throw Errors.internal
    }
  }

  id: string

  outputObject: OutputObject = outputHls()

  outputPrefix = './temporary/streams/webrtc'

  get pathPrefix(): string { return path.resolve(this.outputPrefix, this.id) }

  state: string

  update(segment: Segment): WithError {
    const { outputObject, pathPrefix, destination } = this
    const { fps } = outputObject
    fs.mkdirSync(pathPrefix, { recursive: true })

    // TODO: migrate to constructor args

    try {
      const existing = CommandFactory.get(this.id)
      if (existing) {
        console.log(this.constructor.name, "update destroying existing command")
        CommandFactory.delete(this.id)
      }

      // const { layers } = segment

      // const commandInputs: CommandInput[] = []
      // const complexFilter = layers.flatMap((layer, track) => {
      //   const { merger, filters, inputs } = layer
      //   if (!inputs) console.log(this.constructor.name, "update layer with no inputs", layer)
      //   inputs?.forEach(input => {
      //     const { source, options } = input
      //     if (!source) throw 'no source'

      //     const absolute = source.startsWith('http')
      //     const localPath = absolute ? source : path.resolve(prefix, source)
      //     const exists = absolute || fs.existsSync(localPath)
      //     if (!exists) {
      //       console.error(this.constructor.name, "update could not find", source)
      //       throw `NOT FOUND ${localPath}`
      //     }
      //     console.log(this.constructor.name, "update found", localPath)


      //     const object: ValueObject = options || {}
      //     object.r = fps
      //     object.loop = 1

      //     const commandInput: GraphInput = {
      //       source: localPath,
      //       options: object
      //     }
      //     commandInputs.push(commandInput)
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

      const options = segmentToCommandOptions(segment)

      const command = CommandFactory.instance(this.id, options)
      command.addListener('error', (...args:any[]) => {
        console.error("EncodeConnection", ...args)
        this.update(this.defaultSegment(outputObject))
      })
      const streamCommand = {
        destination,
        command,
      }

      this.streamCommands.unshift(streamCommand)

      streamCommand.command.run()

    } catch (error) {
      console.error(error)
      return { error: String(error) }
    }

    return {}
  }

  streamCommands: StreamConnectionCommand[] = []

  toJSON():UnknownObject {
    return { id: this.id, state: this.state }
  }

  static close():void {
    this.getConnections().forEach(connection => { this.deleteConnection(connection) })
  }

  static connectionsById = new Map<string, EncodeConnection>()

  static callbacksByConnection = new Map<EncodeConnection, () => void>()

  static create(id: string, outputPrefix?: string, outputObject?: OutputObject): EncodeConnection {
    const connection = new EncodeConnection(id, outputPrefix, outputObject)
    console.log("EncodeConnection.create", connection.constructor.name, id, outputPrefix)
    const closedListener = () => { this.deleteConnection(connection) }
    this.callbacksByConnection.set(connection, closedListener)
    connection.once('closed', closedListener)

    this.connectionsById.set(connection.id, connection)

    return connection
  }

  static deleteConnection(connection: EncodeConnection):void {
    this.connectionsById.delete(connection.id)

    const closedListener = this.callbacksByConnection.get(connection)

    console.log(this.constructor.name, "deleteConnection", connection.id, !!closedListener)
    if (!closedListener) return

    this.callbacksByConnection.delete(connection)
    connection.removeListener('closed', closedListener)
  }

  static get(id:string):EncodeConnection | null {
    return this.connectionsById.get(id) || null
  }

  static getConnections(): EncodeConnection[] {
    return [...this.connectionsById.values()]
  }
}

export { EncodeConnection, StreamConnectionCommand }
