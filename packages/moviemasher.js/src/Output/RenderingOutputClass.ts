import { ValueObject } from "../declarations"
import { Size, sizeEven, assertSize, isSize, sizeScale, sizeCover, sizeAboveZero } from "../Utility/Size"
import { GraphFiles, GraphFileArgs, GraphFileOptions } from "../MoveMe"
import { EmptyMethod } from "../Setup/Constants"
import { AVType, GraphType, isLoadType, OutputType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { Time } from "../Helpers/Time/Time"
import { TimeRange } from "../Helpers/Time/Time"
import {
  CommandDescription, RenderingDescription, RenderingResult
} from "../Api/Rendering"
import { RenderingCommandOutput, RenderingOutput, RenderingOutputArgs } from "./Output"
import {
  timeFromArgs, timeRangeFromArgs, timeRangeFromTimes
} from "../Helpers/Time/TimeUtilities"
import { assertAboveZero, isAboveZero, isPositive } from "../Utility/Is"
import { assertClip, Clip } from "../Media/Clip/Clip"
import { assertUpdatableDurationDefinition, isUpdatableDurationDefinition } from "../Mixin/UpdatableDuration/UpdatableDuration"
import { isUpdatableSizeDefinition, UpdatableSizeDefinition } from "../Mixin/UpdatableSize/UpdatableSize"
import { FilterGraphsOptions } from "../Edited/Mash/FilterGraphs/FilterGraphs"

export class RenderingOutputClass implements RenderingOutput {
  constructor(public args: RenderingOutputArgs) {}

  protected assureClipFrames(): void {
    const { durationClips, args } = this
    const { quantize } = args.mash
    durationClips.forEach(clip => {
      assertClip(clip)

      const { content } = clip
      const { definition } = content
      if (isUpdatableDurationDefinition(definition)) {
        const frames = definition.frames(quantize)
        // console.log(this.constructor.name, "assureClipFrames", clip.label, frames, definition.duration)
        if (frames) clip.frames = frames
      }
    })
  }

  protected _avType = AVType.Both
  get avType() { return this._avType }

  get avTypeNeededForClips(): AVType {
    const { avType } = this
    if (avType !== AVType.Both) return avType

    const { renderingClips } = this
    const types = new Set<AVType>()
    renderingClips.forEach(renderingClip => {
      if (renderingClip.audible) types.add(AVType.Audio)
      if (renderingClip.visible) types.add(AVType.Video)
    })
    // console.log(this.constructor.name, "avTypeNeededForClips", types)
    if (types.size === 2) return avType
    const [type] = types
    return type
  }

  _commandOutput?: RenderingCommandOutput
  get commandOutput(): RenderingCommandOutput {
    if (this._commandOutput) return this._commandOutput

    const options: ValueObject = { ...this.args.commandOutput.options }
    const commandOutput: RenderingCommandOutput = { ...this.args.commandOutput, options }
    return this._commandOutput = commandOutput
  }

  get duration(): number { return this.timeRange.lengthSeconds }

  private get durationClips(): Clip[] {
    const { mash } = this.args
    const { frames } = mash
    if (isPositive(frames)) {
      // console.log(this.constructor.name, "durationClips mash is", frames, "frames")
      return []
    }

    const { clips } = mash
    const zeroClips = clips.filter(clip => !isAboveZero(clip.frames))

    // console.log(this.constructor.name, "durationClips", frames, clips.length, zeroClips.length)
    return zeroClips
  }

  get endTime(): Time | undefined {
    return this.args.endTime || this.args.mash.endTime
  }

  // private _filterGraphs?: FilterGraphsthis._filterGraphs =
  get filterGraphs() { 
    const { filterGraphsOptions } = this
    // console.log(this.constructor.name, "filterGraphs", filterGraphsOptions)
    return this.args.mash.filterGraphs(filterGraphsOptions)
  }

  get filterGraphsOptions(): FilterGraphsOptions {
    const { timeRange: time, graphType, videoRate } = this
    const size = this.sizeCovered()

    const filterGraphsOptions: FilterGraphsOptions = {
      time, graphType, videoRate, size, avType: this.avTypeNeededForClips
    }

    return filterGraphsOptions
  }

  graphType = GraphType.Mash

  protected get mashDurationPromise(): Promise<void> {
    const clips = this.durationClips
    // console.log(this.constructor.name, "mashDurationPromise", clips.length, "clip(s)")

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
      streaming: graphType === GraphType.Cast,
    }
    const graphFiles = clips.flatMap(clip => {
      const args: GraphFileArgs = { 
        ...options, quantize, time, clipTime: clip.timeRange(quantize)
      }
      return clip.clipGraphFiles(args)
    })
   
    const files = graphFiles.filter(graphFile => isLoadType(graphFile.type))
    // console.log(this.constructor.name, "mashDurationPromise", files.length, "file(s)")

    const { preloader } = mash
    return preloader.loadFilesPromise(files).then(() => { 
      // console.log(this.constructor.name, "mashDurationPromise loadFilesPromise done, calling assureClipFrames")

      this.assureClipFrames() 
    })
  }

  get mashSize(): Size | undefined {
    const { visibleGraphFiles: graphFiles } = this
    const definitions = graphFiles.map(graphFile => graphFile.definition)
    const updatable = definitions.filter(def => isUpdatableSizeDefinition(def))
    const set = new Set(updatable as UpdatableSizeDefinition[])
    const unique = [...set]
    const sized = unique.filter(definition => definition.sourceSize)
    if (!sized.length) return

    const sizes = sized.map(definition => definition.sourceSize!)
    return {
      width: Math.max(...sizes.map(size => size.width)),
      height: Math.max(...sizes.map(size => size.height))
    }
  }

  get outputCover(): boolean { return !!this.args.commandOutput.cover }

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
    // console.log(this.constructor.name, "preloadPromise")
    return this.filterGraphs.loadPromise 
  }

  get renderingClips(): Clip[] {
    return this.args.mash.clipsInTimeOfType(this.timeRange, this.avType)
  }

  renderingDescriptionPromise(renderingResults?: RenderingResult[]): Promise<RenderingDescription> {
    // console.log(this.constructor.name, "renderingDescriptionPromise")

    let promise = this.mashDurationPromise
    promise = promise.then(() => {
      // console.log(this.constructor.name, "renderingDescriptionPromise mashDurationPromise done")
      return this.sizePromise
    })
    promise = promise.then(() => {
      // console.log(this.constructor.name, "renderingDescriptionPromise sizePromise")
      return this.preloadPromise
    })
    return promise.then(() => {
      // console.log(this.constructor.name, "renderingDescriptionPromise preloadPromise calling done, calling assureClipFrames")
      this.assureClipFrames()

      const { commandOutput } = this
      const renderingDescription: RenderingDescription = { commandOutput }
      const avType = this.avTypeNeededForClips
      const { filterGraphs } = this
      // console.log(this.constructor.name, "renderingDescriptionPromise avType", avType)
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
        const { filterGraphAudible, duration } = filterGraphs
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

  get renderingDescription(): RenderingDescription {
    const { commandOutput } = this
    const renderingDescription: RenderingDescription = { commandOutput }
    const avType = this.avTypeNeededForClips
    const { filterGraphs } = this
    // console.log(this.constructor.name, "renderingDescriptionPromise avType", avType)
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
      const { filterGraphAudible, duration } = filterGraphs
      if (filterGraphAudible) {
        const { commandFilters, commandInputs: inputs } = filterGraphAudible
       
        const commandDescription: CommandDescription = {
          inputs, commandFilters, duration, avType: AVType.Audio
        }
        renderingDescription.audibleCommandDescription = commandDescription
      }
    }
    return renderingDescription
  }

  get startTime(): Time {
    if (this.args.startTime) return this.args.startTime

    const { quantize, frame } = this.args.mash
    return timeFromArgs(frame, quantize)
  }

  sizeCovered(): Size {
    const { outputSize, outputCover } = this
    if (!outputCover) {
      // console.log(this.constructor.name, "sizeCovered mashSize false outputCover", outputSize)
      return outputSize
    }
    const { mashSize } = this
    if (!isSize(mashSize)) {
      // console.log(this.constructor.name, "sizeCovered mashSize false outputSize", outputSize)
      return outputSize // mash doesn't care about size
    }
    const { width, height } = mashSize
    assertAboveZero(width)
    assertAboveZero(height)
  
    const sizeEven = sizeCover(mashSize, outputSize)
    // console.log(this.constructor.name, "sizeCovered", mashSize, outputSize, "=>", sizeEven)

    return sizeEven
  }

  get sizePromise(): Promise<void> {
    // console.log(this.constructor.name, "sizePromise")
    if (this.avType === AVType.Audio || !this.outputCover) return Promise.resolve()

    const { visibleGraphFiles } = this
    // console.log(this.constructor.name, "sizePromise", visibleGraphFiles.length, "visibleGraphFile(s)")
    if (!visibleGraphFiles.length) return Promise.resolve()

    const graphFiles = visibleGraphFiles.filter(graphFile => {
      const { definition } = graphFile
      if (!isUpdatableSizeDefinition(definition)) return false

      return !sizeAboveZero(definition.sourceSize)
    })
    if (!graphFiles.length) return Promise.resolve()

    const { preloader } = this.args.mash
    return preloader.loadFilesPromise(graphFiles).then(EmptyMethod)
  }

  get timeRange(): TimeRange { return timeRangeFromTimes(this.startTime, this.endTime) }

  get videoRate(): number { return this.args.commandOutput.videoRate || 0 }

  get visibleGraphFiles(): GraphFiles {
    const { timeRange: time } = this

    const filterGraphOptions: GraphFileOptions = {
      visible: true, time, quantize: this.args.mash.quantize
    }
    const graphFiles = this.args.mash.graphFiles(filterGraphOptions)
    return graphFiles
  }
}
