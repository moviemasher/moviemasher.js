import { GraphFile, GraphFiles, Size, ValueObject } from "../declarations"
import { EmptyMethod } from "../Setup/Constants"
import { AVType, GraphType, OutputType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { Time } from "../Helpers/Time/Time"
import { TimeRange } from "../Helpers/Time/Time"
import { Clip, ClipDefinition, Clips } from "../Mixin/Clip/Clip"
import { VisibleDefinition } from "../Mixin/Visible/Visible"
import { CommandDescription, RenderingDescription, RenderingResult } from "../Api/Rendering"
import { LoadedInfo } from "../Preloader/Preloader"
import { RenderingCommandOutput, RenderingOutput, RenderingOutputArgs } from "./Output"
import { FilterGraphOptions } from "../Edited/Mash/FilterGraph/FilterGraph"
import { timeFromArgs, timeRangeFromArgs, timeRangeFromTimes } from "../Helpers/Time/TimeUtilities"

class RenderingOutputClass implements RenderingOutput {
  constructor(args: RenderingOutputArgs) {
    this.args = args
  }

  private applyLoadedInfo(graphFile: GraphFile, loadedInfo: LoadedInfo): void {
    const { definition } = graphFile
    if (!definition) throw Errors.invalid.object

    const clipDefinition = definition as ClipDefinition
    const { duration, width, height } = loadedInfo
    if (duration) {
      clipDefinition.duration = duration
      // console.log(this.constructor.name, "applyLoadedInfo duration", duration, clipDefinition.toJSON())
    } // else console.log(this.constructor.name, "applyLoadedInfo no duration for", clipDefinition.toJSON())
    if (clipDefinition.visible) {
      if (width && height) {
        const visibleDefinition = clipDefinition as VisibleDefinition
        visibleDefinition.width = width
        visibleDefinition.height = height
        // console.log(this.constructor.name, "applyLoadedInfo dimensions", width, "x", height, clipDefinition.toJSON())
      } // else console.log(this.constructor.name, "applyLoadedInfo no dimensions", width, height, clipDefinition.visible)
    }
  }

  args: RenderingOutputArgs

  protected assureClipFrames(): void {
    const { durationClips, args } = this
    const { quantize } = args.mash
    durationClips.forEach(clip => {
      const { definition } = clip
      const frames = definition.frames(quantize)
        // console.log(this.constructor.name, "assureClipFrames", clip.label, frames)
      if (frames) clip.frames = frames
    })
  }

  avType = AVType.Both

  _commandOutput?: RenderingCommandOutput
  get commandOutput(): RenderingCommandOutput {
    if (this._commandOutput) return this._commandOutput

    const options: ValueObject = { ...this.args.commandOutput.options }
    const commandOutput: RenderingCommandOutput = { ...this.args.commandOutput, options }
    return this._commandOutput = commandOutput
  }

  get duration(): number { return this.timeRange.lengthSeconds }

  protected get durationClips(): Clips {
    const { mash } = this.args
    if (mash.frames !== -1) return []

    return mash.clips.filter(clip => clip.frames < 1)
  }

  get endTime(): Time | undefined {
    return this.args.endTime || this.args.mash.endTime
  }

  get filterGraphOptions(): FilterGraphOptions {
    const { timeRange: time, graphType, avType, videoRate } = this
    const filterGraphOptions: FilterGraphOptions = {
      time,
      preloading: false,
      size: this.sizeCovered(), videoRate,
      graphType, avType
    }
    return filterGraphOptions
  }

  graphType = GraphType.Mash

  private loadWithInfoPromise(graphFiles: GraphFiles): Promise<void> {
    if (!graphFiles.length) return Promise.resolve()

    const { preloader } = this.args.mash
    const promises = graphFiles.map(graphFile => {
      return preloader.loadFilePromise(graphFile).then(graphFile =>{
        return preloader.fileInfoPromise(graphFile).then(loadedInfo => {
          this.applyLoadedInfo(graphFile, loadedInfo)
        })
      })
    })
    return Promise.all(promises).then(EmptyMethod)
  }

  protected get mashDurationPromise(): Promise<void> {
    const clips = this.durationClips
    if (!clips.length) {
      // console.log(this.constructor.name, "mashDurationPromise with no duration clips")
      return Promise.resolve()
    }

    const startFrames = clips.map(clip => clip.frame)
    const startFrame = Math.min(...startFrames)
    const endFrame = Math.max(...startFrames)
    const { mash } =  this.args
    const { quantize } = mash
    const time = timeRangeFromArgs(startFrame, quantize, endFrame + 1)

    const { avType, graphType, outputSize: size, videoRate } = this
    const filterGraphOptions: FilterGraphOptions = {
      time, avType, graphType, size, videoRate, preloading: true
    }
    const files = mash.filterGraphs(filterGraphOptions).graphFilesLoadable

    // console.log(this.constructor.name, "mashDurationPromise loading", files.length, "file(s) for ", clips.length, "clip(s)", filterGraphOptions)
    const { preloader } = mash
    return preloader.loadFilesPromise(files).then(() => {
      return this.loadWithInfoPromise(files).then(() => { this.assureClipFrames() })
    })
  }

  get mashSize(): Size | undefined {
    const { visibleGraphFiles } = this
    const visible = visibleGraphFiles.map(graphFile => graphFile.definition).filter(Boolean)
    const definitions = [...new Set(visible.map(definition => definition as VisibleDefinition))]
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

  get outputCover(): boolean { return false }

  get outputSize(): Size {
    const { width, height } = this.args.commandOutput
    if (!(width && height)) {
      if (this.avType === AVType.Audio) return { width: 0, height: 0 }

      console.error(this.constructor.name, "outputSize", this.args.commandOutput)
      throw Errors.invalid.size + this.outputType + '.outputSize for avType ' + this.avType
    }
    return { width, height }
  }

  outputType!: OutputType

  get preloadPromise(): Promise<void> {
    const { timeRange, avType, graphType, videoRate } = this
    const args: FilterGraphOptions = {
      time: timeRange, avType, graphType, size: this.outputSize, videoRate
    }

        // console.log(this.constructor.name, "preloadPromise", args)
    return this.args.mash.loadPromise(args)
  }

  get renderingClips(): Clip[] {
    return this.args.mash.clipsInTimeOfType(this.timeRange, this.avType)
  }

  renderingDescriptionPromise(renderingResults?: RenderingResult[]): Promise<RenderingDescription> {
    const { avType, args } = this
    const { mash } = args
    let promise = this.mashDurationPromise
    promise = promise.then(() => this.sizePromise)
    promise = promise.then(() => this.preloadPromise)
    return promise.then(() => {
      const { commandOutput, filterGraphOptions } = this
      const filterGraphs = mash.filterGraphs(filterGraphOptions)
      const renderingDescription: RenderingDescription = { commandOutput }
      const { duration } = filterGraphs
      if (avType !== AVType.Audio) {
        const { filterGraphsVisible } = filterGraphs
        const visibleCommandDescriptions = filterGraphsVisible.map(filterGraph => {
          const { graphFilters, commandInputs: inputs, duration } = filterGraph
          const commandDescription: CommandDescription = { inputs, graphFilters, duration }
          return commandDescription
        })
        renderingDescription.visibleCommandDescriptions = visibleCommandDescriptions
      }
      if (avType !== AVType.Video) {
        const { filterGraphAudible } = filterGraphs
        if (filterGraphAudible) {
          const { graphFilters, commandInputs: inputs } = filterGraphAudible
          const commandDescription: CommandDescription = {
            inputs, graphFilters, duration
          }
          renderingDescription.audibleCommandDescription = commandDescription
        }
      }
      return renderingDescription
    })
  }

  get startTime(): Time {
    if (this.args.startTime) return this.args.startTime

    const { quantize, frame } = this.args.mash
    return timeFromArgs(frame, quantize)
  }

  sizeCovered(): Size {
    const { outputSize } = this
    if (!this.outputCover) return outputSize

    const sizeMash = this.mashSize
    if (!sizeMash) return outputSize // mash doesn't care about size

    if (sizeMash.width === 0 || sizeMash.height == 0) throw Errors.internal + 'sizeCovered'

    const horzRatio = outputSize.width / sizeMash.width
    const vertRatio = outputSize.height / sizeMash.height
    const scale = Math.max(horzRatio, vertRatio)
    if (scale >= 1.0) return sizeMash

    if (horzRatio > vertRatio) outputSize.height = Math.round(scale * sizeMash.height)
    else outputSize.width = Math.round(scale * sizeMash.width)

    return outputSize
  }

  get sizePromise(): Promise<void> {
    if (!this.outputCover) return Promise.resolve()

    const { timeRange: time, graphType, videoRate } = this

    const filterGraphOptions: FilterGraphOptions = {
      avType: AVType.Video, graphType, time,
      size: this.outputSize, videoRate
    }
    const visibleGraphFiles = this.args.mash.graphFiles(filterGraphOptions)
    if (!visibleGraphFiles.length) return Promise.resolve()

    const graphFiles = visibleGraphFiles.filter(graphFile => {
      const { definition } = graphFile
      const visibleDefinition = definition as VisibleDefinition
      return !(visibleDefinition.width && visibleDefinition.height)
    })
    if (!graphFiles.length) return Promise.resolve()

    return this.loadWithInfoPromise(graphFiles)
  }

  get timeRange(): TimeRange { return timeRangeFromTimes(this.startTime, this.endTime) }

  get videoRate(): number { return this.args.commandOutput.videoRate || 0 }

  get visibleGraphFiles(): GraphFiles {
    const { timeRange: time, graphType, videoRate } = this

    const filterGraphOptions: FilterGraphOptions = {
      avType: AVType.Video, graphType, time,
      size: this.outputSize, videoRate
    }
    const graphFiles = this.args.mash.graphFiles(filterGraphOptions)
    return graphFiles
  }
}

export { RenderingOutputClass }
