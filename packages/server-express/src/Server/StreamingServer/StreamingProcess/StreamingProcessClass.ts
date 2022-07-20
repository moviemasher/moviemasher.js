import fs from 'fs'
import {
  DefinitionObjects, DefinitionType, ImageDefinitionObject,
  MashObject, OutputFormat, TrackType, UnknownObject, CommandInput, ValueObject,
  VideoStreamOutputArgs, VideoStreamOutputClass, WithError, mashInstance, ExtTs, ExtHls, CommandOptions, VisibleClipObject,
} from "@moviemasher/moviemasher.js"
import EventEmitter from "events"
import path from "path"
import { RunningCommand } from "../../../RunningCommand/RunningCommand"
import { runningCommandDelete, runningCommandInstance } from "../../../RunningCommand/RunningCommandFactory"
import { NodeLoader } from "../../../Utilities/NodeLoader"

import { StreamingProcessArgs, StreamingProcessCutArgs } from "./StreamingProcess"
import { directoryLatest } from '../../../Utilities/Directory'

import { idUnique } from "../../../Utilities/Id"

// const StreamingProcessClearPng = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIAAAUAAeImBZsAAAAASUVORK5CYII="


export class StreamingProcessClass extends EventEmitter {
  constructor(args: StreamingProcessArgs) {
    super()
    this.args = args
    const { id } = args

    this.id = id
    this.state = 'open'
  }
  args: StreamingProcessArgs

  close(): void {
    this.state = 'closed'
    this.emit('closed')
  }

  command?: RunningCommand

  cut(args: StreamingProcessCutArgs): WithError {
    const { cacheDirectory, filePrefix, defaultDirectory, validDirectories } = this.args
    const { mashObjects, definitionObjects } = args
    const preloader = new NodeLoader(cacheDirectory, filePrefix, defaultDirectory, validDirectories)
    const mashes = mashObjects.map(mashObject => {
      return mashInstance({ ...mashObject, definitionObjects, preloader })
    })
    const commandOutput = { ...this.args.commandOutput, options: this.currentOptions }

    const streamArgs: VideoStreamOutputArgs = { commandOutput, cacheDirectory, mashes }
    const output = new VideoStreamOutputClass(streamArgs)
    const videoRate = output.args.commandOutput.videoRate

    const { pathPrefix, destination } = this
    fs.mkdirSync(pathPrefix, { recursive: true })
    try {
      if (this.command) {
        // console.log(this.constructor.name, "cut deleting existing command")
        runningCommandDelete(this.command.id)
        // this.command.removeAllListeners('error')
      }

      output.streamingDescription().then(streamingDescription => {
        const { commandOutput, inputs } = streamingDescription
        // streams require at least one real input
        if (!inputs?.length) {
          const input: CommandInput = {
            source: './img/c.png', options: { r: videoRate, loop: 1 }
          }
          streamingDescription.inputs = [input]
        }

        // TODO: there shouldn't be any relative paths at this point, but we added one above!
        const prefix = '../example-express-react/dist'

        streamingDescription.inputs?.forEach(input => {
          const { source } = input
          if (!source) throw 'no source'
          if (typeof source !== 'string') return
          if (source.includes('://')) return

          const resolved = path.resolve(prefix, source)
          const url = `file://${resolved}`
          // console.log(this.constructor.name, "update resolved", source, 'to', url)

          const exists = fs.existsSync(source)
          if (!exists) {
            console.error(this.constructor.name, "could not find", source, url)
            throw `NOT FOUND ${url}`
          }
          input.source = url
        })
        const commandOptions: CommandOptions = {
          ...streamingDescription, output: commandOutput
        }
        this.command = runningCommandInstance(idUnique(), commandOptions)
        this.command.addListener('error', this.error.bind(this))
        this.command.run(destination)
      })
    } catch (error) {
      console.error(this.constructor.name, "update CATCH", error)
      return { error: String(error) }
    }
    return {}
  }

  defaultContent(): StreamingProcessCutArgs {
    const source = '../shared/image/favicon.ico'
    const contentId = 'image'
    const definitionObject: ImageDefinitionObject = {
      source, id: contentId, type: DefinitionType.Image, url: source
    }
    const clip: VisibleClipObject = { contentId, width: 0.2 }
    const mashObject: MashObject = {
      backcolor: "#000000",
      tracks: [{ trackType: TrackType.Video, clips: [clip] }]
    }
    const definitionObjects: DefinitionObjects = [definitionObject]
    const mashObjects: MashObject[] = [mashObject]
    const args: StreamingProcessCutArgs = { mashObjects, definitionObjects }
    return args
  }

  get destination(): string { return `${this.pathPrefix}/${this.args.file}` }

  error(error: any) {
    if (String(error).includes('SIGKILL')) { return }

    console.error("StreamingProcessClass", "errorCallback", error)
    this.cut(this.defaultContent())
  }

  id: string

  private get currentOptions(): ValueObject {
    const { options, format } = this.args.commandOutput
    if (format !== OutputFormat.Hls) return options

    const { id, pathPrefix } = this

    const hlsFile = directoryLatest(pathPrefix, ExtHls)
    if (hlsFile) {
      options.hls_flags ||= ''
      options.hls_flags += `${options.hls_flags ? '+' : ''}append_list`

      const number = this.latestTsNumber
      if (typeof number !== 'undefined') options.start_number = number + 1
    }
    const { hls_segment_filename } = options
    if (typeof hls_segment_filename === 'string') {
      if (!hls_segment_filename.includes('/')) {
        options.hls_segment_filename = `${pathPrefix}/${hls_segment_filename}`
      }
    }

    return options
  }

  private get latestTsNumber(): number | undefined {
    const file = directoryLatest(this.pathPrefix, ExtTs)
    if (!file) return

    return Number(path.basename(file, `.${ExtTs}`))
  }

  get pathPrefix(): string { return path.resolve(this.args.directory, this.id) }

  state: string

  toJSON():UnknownObject {
    return { id: this.id, state: this.state }
  }
}
