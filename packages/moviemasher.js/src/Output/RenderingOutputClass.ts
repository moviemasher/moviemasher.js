import { CommandArgs, CommandInputs, RenderingResult } from "../Api/Rendering"
import { FilesArgs, FilterChain, FilterGraph, FilterGraphArgs, FilterGraphOptions, GraphFile, GraphFiles, GraphFilters, GraphInput, Size, ValueObject } from "../declarations"
import { Time } from "../Helpers/Time"
import { TimeRange } from "../Helpers/TimeRange"
import { Clip, ClipDefinition, Clips } from "../Mixin/Clip/Clip"
import { VisibleDefinition } from "../Mixin/Visible/Visible"
import { LoadedInfo } from "../Preloader/Preloader"
import { EmptyMethod } from "../Setup/Constants"
import { AVType, DefinitionType, GraphType, LoadType, LoadTypes, OutputType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { RenderingOutput, RenderingOutputArgs } from "./Output"

class RenderingOutputClass implements RenderingOutput {
  constructor(args: RenderingOutputArgs) {
    this.args = args
  }
  args: RenderingOutputArgs

  avType = AVType.Both

  protected commandArgs(filterGraph: FilterGraph): CommandArgs {
    const { filterChains, duration, avType } = filterGraph
    const commandInputs: CommandInputs = []
    const graphFilters: GraphFilters = []
    if (!duration) throw 'duration'

    const options: ValueObject = { ...this.args.commandOutput.options }
    const commandOutput = { ...this.args.commandOutput, options }
    // console.log(this.constructor.name, "commandArgs", commandOutput)
    const { outputType } = this
    switch (outputType) {
      case OutputType.Image:
      case OutputType.Waveform: {
        options['frames:v'] = 1
        break
      }
      default: options.t ||= duration
    }
    if (avType === AVType.Audio) {
      delete commandOutput.videoCodec
      delete commandOutput.videoRate
    } else if (avType === AVType.Video) {
      delete commandOutput.audioCodec
      delete commandOutput.audioBitrate
      delete commandOutput.audioChannels
      delete commandOutput.audioRate
    }

    filterChains.forEach((filterChain: FilterChain) => {
      const { graphFilter, graphFilters: filters, graphFiles } = filterChain
      graphFiles.forEach(graphFile => {
        const { type, file, input, options } = graphFile
        if (!input) return

        switch (type) {
          case LoadType.Video:
          case LoadType.Image: {
            const input: GraphInput = { source: file, options }
            commandInputs.push(input)
            break
          }
        }
      })

      graphFilters.push(...filters)
      if (graphFilter) graphFilters.push(graphFilter)
    })
    const commandOptions: CommandArgs = {
      inputs: commandInputs, graphFilters, output: commandOutput
    }
    return commandOptions
  }

  commandArgsPromise(renderingResults?: RenderingResult[]): Promise<CommandArgs[]> {
    // console.log(JSON.stringify(this.args.mash))
    let promise = this.durationPromise
    promise = promise.then(() => this.sizePromise)
    promise = promise.then(() => this.preloadPromise)

    const { mash } = this.args
    return promise.then(() => {
      // console.log("SIZE", size)
      const args = this.filterGraphArgs

      const filterGraphs = mash.filterGraphs(args)
      // if (filterGraphs.length > 1)
      // console.log('commandArgsPromise', filterGraphs.flatMap(f => f.filterChains.flatMap(c => c.graphFilters.map(g => g.options))))
      const commandArgs = filterGraphs.map(filterGraph => this.commandArgs(filterGraph))
      // console.log('commandArgsPromise', commandArgs)
      return commandArgs
    })
  }

  private _duration = 0
  get duration(): number {
    if (!this._duration) {
      this._duration = this.args.mash.duration
    }
    return this._duration
  }

  protected get durationClips(): Clips {
    const { mash } = this.args
    if (mash.frames !== -1) return []

    return mash.clips.filter(clip => clip.frames < 1)
  }

  protected loadableGraphFiles(clips: Clips): GraphFiles {
    const { quantize } = this.args.mash
    const time = Time.fromArgs(0, quantize)
    const { avType, graphType } = this
    const graphFiles: GraphFiles = clips.flatMap(clip => {
      const args = { avType, graphType, quantize, start: time.withFrame(clip.frame) }
      return clip.files(args).filter(file => LoadTypes.includes(file.type))
    })
    return graphFiles
  }


  private applyLoadedInfo(graphFile: GraphFile, loadedInfo: LoadedInfo): void {
    const { definition } = graphFile
    if (!definition) throw Errors.invalid.object

    const clipDefinition = definition as ClipDefinition

    const { duration, width, height } = loadedInfo
    if (duration) clipDefinition.duration = duration

    if (width && height && clipDefinition.visible) {
      // console.log(this.constructor.name, "applyLoadedInfo", width, height, clipDefinition.toJSON())
      const visibleDefinition = clipDefinition as VisibleDefinition
      visibleDefinition.width = width
      visibleDefinition.height = height
    } else console.log(this.constructor.name, "applyLoadedInfo", width, height, clipDefinition.visible)
  }

  protected assureClipFrames(): void {
    const { durationClips, args } = this
    const { quantize } = args.mash
    durationClips.forEach(clip => {
      const { definition } = clip
      clip.frames = definition.frames(quantize)
    })
  }

  get sizePromise(): Promise<void> {
    const { outputCover, args, visibleGraphFiles } = this
    if (!outputCover) return Promise.resolve()

    const graphFiles = visibleGraphFiles.filter(graphFile => {
      const { definition } = graphFile
      const visibleDefinition = definition as VisibleDefinition
      return !(visibleDefinition.width && visibleDefinition.height)
    })
    return this.loadAndApplyPromise(graphFiles)
  }

  private loadAndApplyPromise(graphFiles: GraphFiles): Promise<void> {
    if (!graphFiles.length) {
      // console.log(this.constructor.name, "loadAndApplyPromise no graphFiles")
      return Promise.resolve()
    }
    const { preloader } = this.args.mash
    const promises = graphFiles.map(graphFile =>
      preloader.loadFilePromise(graphFile).then(graphFile =>
        preloader.fileInfoPromise(graphFile).then(loadedInfo =>
          this.applyLoadedInfo(graphFile, loadedInfo)
        )
      )
    )
    return Promise.all(promises).then(EmptyMethod)
  }

  protected get durationPromise(): Promise<void> {
    const clips = this.durationClips
    if (!clips.length) return Promise.resolve() // all clips have valid frames property

    const graphFiles = this.loadableGraphFiles(clips)
    if (!graphFiles.length) throw Errors.invalid.duration + 'durationPromise'

    return this.loadAndApplyPromise(graphFiles).then(() => { this.assureClipFrames() })
  }

  protected get endTime(): Time | undefined {
    const { quantize, frames } = this.args.mash
    return Time.fromArgs(frames, quantize)
  }

  get filterGraphArgs(): FilterGraphArgs {
    const { args, renderTimeRange, graphType, avType } = this
    const { quantize } = args.mash
    const filterGraphArgs: FilterGraphArgs = {
      justGraphFiles: false,
      size: this.sizeCovered(), videoRate: quantize,
      timeRange: renderTimeRange,
      graphType,
      avType
    }
    return filterGraphArgs
  }

  graphType = GraphType.Mash

  get mashSize(): Size | undefined {
    const definitions = this.visibleDefinitions()
    const sized = definitions.filter(definition => definition.width && definition.height)
    if (!sized.length) return

    const sizes = sized.map(definition => (
      { width: definition.width, height: definition.height }
    ))
    return {
      width: Math.max(...sizes.map(size => size.width)),
      height: Math.max(...sizes.map(size => size.height))
    }
  }

  get renderTimeRange(): TimeRange {
    const { timeRange } = this.args.mash
    return timeRange
  }

  get renderingClips(): Clip[] {
    return this.args.mash.clipsInTimeRange(this.renderTimeRange)
  }

  get outputCover(): boolean { return false }

  outputType!: OutputType

  get outputSize(): Size {
    const { width, height } = this.args.commandOutput
    if (!(width && height)) throw Errors.invalid.size + 'outputSize'

    return { width, height }
  }

  sizeCovered(): Size {
    const outputSize = this.outputSize
    if (!this.outputCover) {
      // console.log(this.constructor.name, "sizeCovered using output size", outputSize)
      return outputSize
    }

    // console.log(this.constructor.name, "sizeCovered", this.outputCover, this.args.commandOutput)
    const sizeMash = this.mashSize
    if (!sizeMash) {
      // console.log(this.constructor.name, "sizeCovered mash has no dimensions", outputSize)
      return outputSize // mash doesn't care about size
    }
    if (sizeMash.width === 0 || sizeMash.height == 0) throw Errors.internal + 'sizeCovered'

    const horzRatio = outputSize.width / sizeMash.width
    const vertRatio = outputSize.height / sizeMash.height
    const scale = Math.max(horzRatio, vertRatio)
    if (scale >= 1.0) {
      // console.log(this.constructor.name, "sizeCovered won't scale up from", sizeMash)

      return sizeMash
    }

    if (horzRatio > vertRatio) {
      outputSize.height = Math.round(scale * sizeMash.height)
      // console.log(this.constructor.name, "sizeCovered preferring horizontal", outputSize, scale, vertRatio)
    }
    else {
      outputSize.width = Math.round(scale * sizeMash.width)
      // console.log(this.constructor.name, "sizeCovered preferring horizontal", outputSize, scale, vertRatio)
    }
    return outputSize
  }

  get preloadPromise(): Promise<void> {
    const { avType, graphType, args } = this
    const { mash } = args
    const filterGraphArgs: FilterGraphOptions = {
      avType, graphType, timeRange: this.renderTimeRange,
      size: this.sizeCovered(), videoRate: this.args.commandOutput.videoRate || 0
    }
    const graphFiles = mash.graphFiles(filterGraphArgs)
    return mash.preloader.loadFilesPromise(graphFiles).then(EmptyMethod)
  }

  get renderStartTime(): Time {
    const { mash } = this.args
    return Time.fromArgs(0, mash.quantize)
  }

  get visibleGraphFiles(): GraphFiles {
    const { args, graphType } = this
    const { mash } = args

    const avType = AVType.Video
    const filterGraphArgs: FilterGraphOptions = {
      avType, graphType, timeRange: this.renderTimeRange,
      size: this.outputSize, videoRate: this.args.commandOutput.videoRate || 0
    }
    const graphFiles = mash.graphFiles(filterGraphArgs)
    return graphFiles
  }

  visibleDefinitions(): VisibleDefinition[] {
    const graphFiles = this.visibleGraphFiles
    const visible = graphFiles.map(graphFile => graphFile.definition).filter(Boolean)
    const definitions = [...new Set(visible.map(definition => definition as VisibleDefinition))]
    return definitions
  }
}

export { RenderingOutputClass }
