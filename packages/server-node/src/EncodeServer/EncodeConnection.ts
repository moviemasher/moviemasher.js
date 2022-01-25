
import fs from 'fs'
import EventEmitter from 'events'
import path from 'path'
import { PassThrough } from 'stream'
import {
  outputHls, Errors, GraphFilter, Segment, UnknownObject, OutputObject, WithError,
  Layer, GraphInput, MashFactory, DefinitionObject, MashObject, SegmentOptions, RenderType, VideoDefinition, Factory, VideoDefinitionObject, ImageDefinitionObject, TrackType, MergerDefinitionObject, MergerObject, ClipObject
} from '@moviemasher/moviemasher.js'

import { StreamOutput } from '../UnixStream/SocketStreams'
import { Command, CommandInput, CommandOptions } from '../Command/Command'
import { CommandFactory } from '../Command/CommandFactory'
import { segmentToCommandArgs } from '../Utilities/Segment'

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
    const width = outputObject.width!
    const height = outputObject.height!
    const videoRate = outputObject.videoRate!

    const source = './dist/favicon.ico'
    const definitionId = 'image'
    const definitionObject: ImageDefinitionObject = {
      source, id: definitionId
    }
    const merger: MergerObject = { definitionId: 'com.moviemasher.merger.center' }
    const clip: ClipObject = { definitionId, merger }
    const mashObject: MashObject = {
      tracks: [{ trackType: TrackType.Video, clips: [clip] }]
    }
    const definitionObjects: DefinitionObject[] = [definitionObject]
    const mash = MashFactory.instance(mashObject, definitionObjects)
    const segmentOptions: SegmentOptions = {
      type: RenderType.Stream, size: { width, height }, videoRate
    }
    return mash.segment(segmentOptions)
    // const colorFilter: GraphFilter = {
    //   filter: 'color',
    //   options: { color: '#000000', size: `${width}x${height}`, rate: videoRate },
    //   outputs: ['COLOR']
    // }
    // const filters: GraphFilter[] = [colorFilter]
    // const options = {
    //   x: 'floor((main_w - overlay_w) / 2)',
    //   y: 'floor((main_h - overlay_h) / 2)'
    // }
    // const merger: GraphFilter = { options, filter: 'overlay', inputs: ['COLOR', '0:v']}
    // const input: GraphInput = { source, options: { loop: 1, re: '' } }

    // const layer: Layer = { filters, merger, layerInputs: [input], files: [] }
    // const layers: Layer[] = [layer]
    // const segment: Segment = { layers }
    // return segment
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
    const videoRate = outputObject.videoRate!
    fs.mkdirSync(pathPrefix, { recursive: true })
    // TODO: migrate to constructor args

    try {
      const existing = CommandFactory.get(this.id)
      if (existing) {
        console.log(this.constructor.name, "update destroying existing command")
        CommandFactory.delete(this.id)
      }

      const options: CommandOptions = segmentToCommandArgs(segment, outputObject, destination)

      // streams require at least one real input
      if (!options.inputs?.length) {
        const input: CommandInput = {
          source: './dist/img/c.png', options: { r: videoRate, loop: 1 }
        }
        options.inputs = [input]
      }
      const serverOptions = { prefix: '../dev/workspaces/example-client-react' }
      const command = CommandFactory.instance(this.id, options, serverOptions)
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
