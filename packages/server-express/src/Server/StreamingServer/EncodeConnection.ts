
import fs from 'fs'
import EventEmitter from 'events'
import path from 'path'
import { PassThrough } from 'stream'
const uuid = require('uuid').v4
import {
  outputDefaultHls, Errors, FilterGraph, UnknownObject, OutputOptions, WithError,
  MashFactory, DefinitionObject, MashObject, FilterGraphsArgs,
  GraphType, ImageDefinitionObject,
  TrackType, MergerObject, ClipObject, DefinitionType, ScalerObject, OutputFormat, FilterGraphArgs, TimeRange, AVType
} from '@moviemasher/moviemasher.js'

import { StreamOutput } from '../../UnixStream/SocketStreams'
import { Command, CommandInput, CommandOptions } from '../../Command/Command'
import { CommandFactory } from '../../Command/CommandFactory'
import { filterGraphToCommandArgs } from '../../Utilities/FilterGraph'

interface StreamConnectionCommand {
  command: Command
  destination: string
}

const EncodeConnectionClearPng = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIAAAUAAeImBZsAAAAASUVORK5CYII="

class EncodeConnection extends EventEmitter {
  constructor(id: string, outputPrefix?: string, outputObject?: OutputOptions) {
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

  command?: Command

  defaultFilterGraph(outputObject: OutputOptions): FilterGraph {
    const width = outputObject.width!
    const height = outputObject.height!
    const videoRate = outputObject.videoRate!

    const source = './favicon.ico'
    const definitionId = 'image'
    const definitionObject: ImageDefinitionObject = {
      source, id: definitionId, type: DefinitionType.Image, url: source
    }
    const merger: MergerObject = { definitionId: 'com.moviemasher.merger.center' }
    const scaler: ScalerObject = { definitionId: 'com.moviemasher.scaler.scale', scale: 0.2 }
    const clip: ClipObject = { definitionId, merger, scaler }
    const mashObject: MashObject = {
      backcolor: "#000000",
      tracks: [{ trackType: TrackType.Video, clips: [clip] }]
    }
    const definitionObjects: DefinitionObject[] = [definitionObject]
    const mash = MashFactory.instance(mashObject, definitionObjects)
    const timeRange = TimeRange.fromArgs()
    const filterGraphArgs: FilterGraphArgs = {
      avType: AVType.Video,
      graphType: GraphType.Cast, size: { width, height }, videoRate, timeRange
    }
    return mash.filterGraph(filterGraphArgs)
  }

  get destination(): string {
    const { outputObject, pathPrefix } = this
    switch (outputObject.format) {
      case OutputFormat.Hls: return `${pathPrefix}/index.m3u8`
      case OutputFormat.Flv: return `${pathPrefix}/index.flv`
      case OutputFormat.Rtmp: return 'rtmps://...'
      case OutputFormat.Pipe: return StreamOutput(new PassThrough(), this.id).url
      default: throw Errors.internal + 'outputObject.format'
    }
  }

  error(error: any) {
    if (String(error).includes('SIGKILL')) { return }

    console.error("EncodeConnection", "errorCallback", error)
    this.update(this.defaultFilterGraph(this.outputObject))
  }

  id: string

  outputObject: OutputOptions = outputDefaultHls()

  outputPrefix = './temporary/streams/webrtc'

  get pathPrefix(): string { return path.resolve(this.outputPrefix, this.id) }

  state: string

  update(segment: FilterGraph, output?: OutputOptions): WithError {
    if (output) this.outputObject = output

    const { outputObject, pathPrefix, destination } = this
    const videoRate = outputObject.videoRate!
    fs.mkdirSync(pathPrefix, { recursive: true })
    try {
      if (this.command) {
        console.log(this.constructor.name, "update deleting existing command")
        CommandFactory.delete(this.command.id)
        // this.command.removeAllListeners('error')
      }

      const options: CommandOptions = filterGraphToCommandArgs(segment, outputObject, destination)

      // streams require at least one real input
      if (!options.inputs?.length) {
        const input: CommandInput = {
          source: './img/c.png', options: { r: videoRate, loop: 1 }
        }
        options.inputs = [input]
      }

      // TODO: there shouldn't be any relative paths at this point, but we add one above!
      const prefix = '../example-client-react/dist'


      options.inputs.forEach(input => {
        const { source } = input
        if (!source) throw 'no source'
        if (typeof source !== 'string') return
        if (source.includes('://')) return

        const resolved = path.resolve(prefix, source)
        const url = `file://${resolved}`
        console.log(this.constructor.name, "update resolved", source, 'to', url)

        const exists = fs.existsSync(url)
        if (!exists) {
          console.error(this.constructor.name, "could not find", source, url)
          throw `NOT FOUND ${url}`
        }
        input.source = url
      })


      this.command = CommandFactory.instance(uuid(), options)
      this.command.addListener('error', this.error.bind(this))

      this.command.run()

    } catch (error) {
      console.error(this.constructor.name, "update CATCH", error)
      return { error: String(error) }
    }
    return {}
  }

  toJSON():UnknownObject {
    return { id: this.id, state: this.state }
  }

  static close():void {
    this.getConnections().forEach(connection => { this.deleteConnection(connection) })
  }

  static connectionsById = new Map<string, EncodeConnection>()

  static callbacksByConnection = new Map<EncodeConnection, () => void>()

  static create(id: string, outputPrefix?: string, outputObject?: OutputOptions): EncodeConnection {
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
