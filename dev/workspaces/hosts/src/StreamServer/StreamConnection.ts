
import fs from 'fs'
import EventEmitter from 'events'
import path from 'path'
import { PassThrough } from 'stream'
import { StreamOutput } from '../SocketStreams'
import { Command, OutputOptions } from '../Command/Command'
import { Default, Errors, InputFilter, MashState, UnknownObject } from '@moviemasher/moviemasher.js'

interface StreamCommand {
  command: Command
  destination: string
}

class StreamConnection extends EventEmitter {
  constructor(id: string, outputPrefix?: string, outputOptions?: OutputOptions) {
    super()
    this.id = id
    this.state = 'open'
    if (outputOptions) this.outputOptions = outputOptions
    if (outputPrefix) this.outputPrefix = outputPrefix
    this.outputOptions.width = 0
    this.outputOptions.height = 0
  }


  close(): void {
    this.state = 'closed'
    this.emit('closed')
  }

  get destination(): string {
    const { outputOptions, pathPrefix } = this
    switch (outputOptions.format) {
      case 'hls': return `${pathPrefix}/index.m3u8`
      case 'flv': return `${pathPrefix}/index.flv`
      case 'rtmp': return 'rtmps://...'
      case 'pipe': return StreamOutput(new PassThrough(), this.id).url
      default: throw Errors.internal
    }
  }

  id: string

  outputOptions: OutputOptions = Command.outputHls()

  outputPrefix = './temporary/streams/webrtc'

  get pathPrefix(): string { return path.resolve(this.outputPrefix, this.id) }
  state: string

  update(json: MashState): UnknownObject {

    const { outputOptions, pathPrefix, destination } = this

    fs.mkdirSync(pathPrefix, { recursive: true })

    const existing = Command.get(this.id)
    if (existing) {
      console.log("destroying existing command")
      Command.delete(this.id)
    }
    const inputs = []
    let lastFilter: InputFilter
    let lastMerger: InputFilter
    const lastTrack = json.length - 1
    const complexFilter = json.flatMap((inputCommand, track) => {
      const { merger } = inputCommand
      const array = inputCommand.filters.map((filter, index) => {
        const { inputs, outputs } = filter
        if (!outputs?.length) filter.outputs = [String(track)]
        if (index) {
          if (!inputs?.length && lastFilter.outputs?.length) {
            filter.inputs = [...lastFilter.outputs]
          }
        }
        lastFilter = filter
        return filter
      })
      if (merger) {
        const { inputs, outputs } = merger
        if (!inputs?.length) {
          merger.inputs = []
          if (lastFilter.outputs?.length && lastMerger.outputs?.length) {
            merger.inputs.push(...lastMerger.outputs, ...lastFilter.outputs)
          }
        }
        if (track !== lastTrack && !outputs?.length) {
          merger.outputs = [`merged${track}`]
        }
        lastMerger = merger
        array.push(merger)
      } else lastMerger = lastFilter
      return array
    })

    const options = {
      inputs,
      complexFilter,
      output: outputOptions,
      destination
    }

    const command = Command.create(this.id, options)

    const streamCommand = {
      destination,
      command,
    }

    this.streamCommands.unshift(streamCommand)

    streamCommand.command.run()

    return streamCommand
  }

  streamCommands: StreamCommand[] = []

  toJSON():UnknownObject {
    return {
      id: this.id, state: this.state,
    }
  }

  static close():void {
    this.getConnections().forEach(connection => { this.deleteConnection(connection) })
  }

  static connectionsById = new Map<string, StreamConnection>()

  static callbacksByConnection = new Map<StreamConnection, () => void>()

  static create(id: string, outputPrefix?: string, outputOptions?: OutputOptions): StreamConnection {
    const connection = new StreamConnection(id, outputPrefix, outputOptions)
    console.log(this.constructor.name, "createConnection", connection.constructor.name, id)
    const closedListener = () => { this.deleteConnection(connection) }
    this.callbacksByConnection.set(connection, closedListener)
    connection.once('closed', closedListener)

    this.connectionsById.set(connection.id, connection)

    return connection
  }

  static deleteConnection(connection: StreamConnection):void {
    this.connectionsById.delete(connection.id)

    const closedListener = this.callbacksByConnection.get(connection)

    console.log(this.constructor.name, "deleteConnection", connection.id, !!closedListener)
    if (!closedListener) return

    this.callbacksByConnection.delete(connection)
    connection.removeListener('closed', closedListener)
  }

  static get(id:string):StreamConnection | null {
    return this.connectionsById.get(id) || null
  }

  static getConnections(): StreamConnection[] {
    return [...this.connectionsById.values()]
  }
}

export { StreamConnection }

// ffmpeg -y -re -loop 1 -i /Users/doug/GitHub/moviemasher.js/dev/assets/globe.jpg -r 30 -filter_complex "color=color=#FF0000:size=100x100:rate=30[1];[0:v][1]overlay=x=100:y=100" -acodec aac -b:a 128k -ac 2 -ar 44100 -vcodec libx264 -f hls -hls_segment_filename /Users/doug/GitHub/moviemasher.js/dev/workspaces/hosts/temp/test/%06d.ts -hls_time 6 -hls_list_size 10 -hls_flags delete_segments -r 30 -g 60 /Users/doug/GitHub/moviemasher.js/dev/workspaces/hosts/temp/test/index.m3u8
