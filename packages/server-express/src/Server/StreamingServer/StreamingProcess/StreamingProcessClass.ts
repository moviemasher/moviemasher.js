import fs from 'fs'
const uuid = require('uuid').v4
import {
  ClipObject, DefinitionObjects, DefinitionType, ImageDefinitionObject,
  MashObject, MergerObject, OutputFormat, ScalerObject, TrackType, UnknownObject, CommandInput, ValueObject,
  VideoStreamOutputArgs, VideoStreamOutputClass, WithError, MashFactory, ExtTs, ExtHls,
} from "@moviemasher/moviemasher.js"
import EventEmitter from "events"
import path from "path"
import { RunningCommand } from "../../../RunningCommand/RunningCommand"
import { RunningCommandFactory } from "../../../RunningCommand/RunningCommandFactory"
import { NodePreloader } from "../../../Utilities/NodePreloader"

import { StreamingProcessArgs, StreamingProcessCutArgs } from "./StreamingProcess"
import { directoryLatest } from '../../../Utilities/Directory'


const StreamingProcessClearPng = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIAAAUAAeImBZsAAAAASUVORK5CYII="


class StreamingProcessClass extends EventEmitter {
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
    const { cacheDirectory, fileDirectory } = this.args
    const { mashObjects, definitionObjects } = args
    const preloader = new NodePreloader(cacheDirectory, fileDirectory)
    const mashes = mashObjects.map(mashObject => {
      const mash = MashFactory.instance(mashObject, definitionObjects)
      mash.preloader = preloader
      return mash
    })
    const commandOutput = { ...this.args.commandOutput, options: this.currentOptions }

    const streamArgs: VideoStreamOutputArgs = { commandOutput, cacheDirectory, mashes }
    const output = new VideoStreamOutputClass(streamArgs)
    const videoRate = output.args.commandOutput.videoRate

    const { pathPrefix, destination } = this
    fs.mkdirSync(pathPrefix, { recursive: true })
    try {
      if (this.command) {
        console.log(this.constructor.name, "cut deleting existing command")
        RunningCommandFactory.delete(this.command.id)
        // this.command.removeAllListeners('error')
      }

      output.commandArgPromise().then(renderCommandArgs => {

        // streams require at least one real input
        if (!renderCommandArgs.inputs?.length) {
          const input: CommandInput = {
            source: './img/c.png', options: { r: videoRate, loop: 1 }
          }
          renderCommandArgs.inputs = [input]
        }

        // TODO: there shouldn't be any relative paths at this point, but we added one above!
        const prefix = '../example-client-react/dist'

        renderCommandArgs.inputs.forEach(input => {
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

        this.command = RunningCommandFactory.instance(uuid(), renderCommandArgs)
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

export { StreamingProcessClass }
