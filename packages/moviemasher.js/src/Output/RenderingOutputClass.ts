import { ValueObject } from "../declarations"
import { Dimensions, dimensionsCover, dimensionsEven } from "../Setup/Dimensions"
import { GraphFiles, GraphFileArgs, GraphFileOptions } from "../MoveMe"
import { EmptyMethod } from "../Setup/Constants"
import { AVType, GraphType, isLoadType, OutputType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { Time } from "../Helpers/Time/Time"
import { TimeRange } from "../Helpers/Time/Time"
import { Clip, Clips } from "../Mixin/Clip/Clip"
import { VisibleDefinition } from "../Mixin/Visible/Visible"
import {
  CommandDescription, RenderingDescription, RenderingResult
} from "../Api/Rendering"
import { RenderingCommandOutput, RenderingOutput, RenderingOutputArgs } from "./Output"
import {
  timeFromArgs, timeRangeFromArgs, timeRangeFromTimes
} from "../Helpers/Time/TimeUtilities"
import { isAboveZero, isPositive } from "../Utility/Is"
import { assertVisibleClip } from "../Media/VisibleClip/VisibleClip"
import { assertUpdatableDurationDefinition } from "../Mixin/UpdatableDuration/UpdatableDuration"
import { isUpdatableDimensionsDefinition } from "../Mixin/UpdatableDimensions/UpdatableDimensions"
import { FilterGraphsOptions } from "../Edited/Mash/FilterGraphs/FilterGraphs"

export class RenderingOutputClass implements RenderingOutput {
  constructor(public args: RenderingOutputArgs) {}

  protected assureClipFrames(): void {
    const { durationClips, args } = this
    const { quantize } = args.mash
    durationClips.forEach(clip => {
      assertVisibleClip(clip)

      const { content } = clip
      const { definition } = content
      assertUpdatableDurationDefinition(definition)
      const frames = definition.frames(quantize)
      // console.log(this.constructor.name, "assureClipFrames", clip.label, frames, definition.duration)
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

  private get durationClips(): Clips {
    const { mash } = this.args
    const { frames } = mash
    if (isPositive(frames)) return []

    const { clips } = mash
    const zeroClips = clips.filter(clip => !isAboveZero(clip.frames))

    // console.log(this.constructor.name, "durationClips", frames, clips.length, zeroClips.length)
    return zeroClips
  }

  get endTime(): Time | undefined {
    return this.args.endTime || this.args.mash.endTime
  }

  get filterGraphsOptions(): FilterGraphsOptions {
    const { timeRange: time, graphType, avType, videoRate } = this

    const filterGraphsOptions: FilterGraphsOptions = {
      time,
      size: this.sizeCovered(), videoRate,
      graphType, avType
    }
    return filterGraphsOptions
  }

  graphType = GraphType.Mash

  protected get mashDurationPromise(): Promise<void> {
    const clips = this.durationClips
    if (!clips.length) return Promise.resolve()

    const startFrames = clips.map(clip => clip.frame)
    const startFrame = Math.min(...startFrames)
    const endFrame = Math.max(...startFrames)
    const { mash } =  this.args
    const { quantize } = mash
    const time = timeRangeFromArgs(startFrame, quantize, endFrame + 1)

    const { avType, graphType } = this
    const options: GraphFileOptions = {
      audible: avType !== AVType.Video,
      visible: avType !== AVType.Audio,
      time, streaming: graphType === GraphType.Cast,
    }
    const files = mash.graphFiles(options).filter(graphFile => isLoadType(graphFile.type))

    const { preloader } = mash
    return preloader.loadFilesPromise(files).then(() => { this.assureClipFrames() })

  }

  get mashSize(): Dimensions | undefined {
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

  get outputDimensions(): Dimensions {
    const { width, height } = this.args.commandOutput
    if (!(width && height)) {
      if (this.avType === AVType.Audio) return { width: 0, height: 0 }

      console.error(this.constructor.name, "outputDimensions", this.args.commandOutput)
      throw Errors.invalid.size + this.outputType + '.outputDimensions for avType ' + this.avType
    }
    return { width, height }
  }

  outputType!: OutputType

  get preloadPromise(): Promise<void> {
    const { filterGraphsOptions } = this
    return this.args.mash.filterGraphs(filterGraphsOptions).loadPromise
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
      const { commandOutput, filterGraphsOptions } = this
      const filterGraphs = mash.filterGraphs(filterGraphsOptions)
      const renderingDescription: RenderingDescription = { commandOutput }
      const { duration } = filterGraphs
      if (avType !== AVType.Audio) {
        const { filterGraphsVisible } = filterGraphs
        const visibleCommandDescriptions = filterGraphsVisible.map(filterGraph => {
          const { commandFilters, commandInputs: inputs, duration } = filterGraph
          const commandDescription: CommandDescription = { inputs, commandFilters, duration, avType: AVType.Video }
        // console.log(this.constructor.name, "renderingDescriptionPromise inputs, commandFilters", inputs, commandFilters)
          return commandDescription
        })
        renderingDescription.visibleCommandDescriptions = visibleCommandDescriptions
      }
      if (avType !== AVType.Video) {
        const { filterGraphAudible } = filterGraphs
        if (filterGraphAudible) {
          const { commandFilters, commandInputs: inputs } = filterGraphAudible
          const commandDescription: CommandDescription = {
            inputs, commandFilters, duration, avType: AVType.Audio
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

  sizeCovered(): Dimensions {
    const { outputDimensions } = this
    if (!this.outputCover) return outputDimensions

    const sizeMash = this.mashSize
    if (!sizeMash) return outputDimensions // mash doesn't care about size

    if (sizeMash.width === 0 || sizeMash.height == 0) throw Errors.internal + 'sizeCovered'

    const horzRatio = outputDimensions.width / sizeMash.width
    const vertRatio = outputDimensions.height / sizeMash.height
    const scale = Math.max(horzRatio, vertRatio)
    if (scale >= 1.0) return sizeMash

    if (horzRatio > vertRatio) outputDimensions.height = scale * sizeMash.height
    else outputDimensions.width = scale * sizeMash.width

    return dimensionsEven(outputDimensions)
  }

  get sizePromise(): Promise<void> {
    if (this.avType === AVType.Audio || !this.outputCover) return Promise.resolve()

    const {visibleGraphFiles} = this
    if (!visibleGraphFiles.length) return Promise.resolve()

    const graphFiles = visibleGraphFiles.filter(graphFile => {
      const { definition } = graphFile
      if (!isUpdatableDimensionsDefinition(definition)) return false

      return !(definition.width && definition.height)
    })
    if (!graphFiles.length) return Promise.resolve()

    const { preloader } = this.args.mash
    return preloader.loadFilesPromise(graphFiles).then(EmptyMethod)
  }

  get timeRange(): TimeRange { return timeRangeFromTimes(this.startTime, this.endTime) }

  get videoRate(): number { return this.args.commandOutput.videoRate || 0 }

  get visibleGraphFiles(): GraphFiles {
    const { timeRange: time } = this

    const filterGraphOptions: GraphFileArgs = {
      visible: true, time, quantize: this.args.mash.quantize
    }
    const graphFiles = this.args.mash.graphFiles(filterGraphOptions)
    return graphFiles
  }
}
