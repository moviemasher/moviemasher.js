
import { 
  isUpdatableDurationDefinition, AVType, 
  Clip, isPositive, IntrinsicOptions, Time, 
  GraphFiles, 

  Clips, PreloadArgs, EmptyMethod, Size, 
  EncodeType, timeFromArgs, timeRangeFromTimes,
  
  RenderingCommandOutput,
  VideoType,
  FontType,
  AudioType,
  ImageType,
  SequenceType,
  errorThrow,
  ErrorName
} from "@moviemasher/moviemasher.js"
import { CommandDescription, RenderingDescription, RenderingOutput, RenderingOutputArgs, RenderingResult } from "./Encode"
import { FilterGraphsOptions } from "./FilterGraphs/FilterGraphs"
import { filterGraphsArgs, filterGraphsInstance } from "./FilterGraphs/FilterGraphsFactory"

export class RenderingOutputClass implements RenderingOutput {
  constructor(public args: RenderingOutputArgs) {}

  protected assureClipFrames(): void {
    const { durationClips, args } = this
    const { quantize } = args.mash
    durationClips.forEach(clip => {
      const { content } = clip
      const { definition } = content
      if (isUpdatableDurationDefinition(definition)) {
        const frames = definition.frames(quantize)
        // console.log(this.constructor.name, "assureClipFrames", clip.label, frames, definition.duration)
        if (frames) clip.frames = frames
      }
    })
  }

  get avType() { 
    switch (this.outputType) {
      case AudioType: return AVType.Audio
      case FontType:
      case SequenceType: 
      case ImageType: return AVType.Video
      case VideoType: return AVType.Both 
    }
  }

  get avTypeNeededForClips(): AVType {
    const { avType } = this
    if (avType !== AVType.Both) return avType

    const renderingClips = this.args.mash.clipsInTimeOfType(this.timeRange, this.avType)
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

  protected get commandOutput(): RenderingCommandOutput { return this.args.commandOutput }


  get duration(): number { 
    if (this.outputType === ImageType) return 0
    
    return this.timeRange.lengthSeconds 
  }

  private _durationClips?: Clip[]
  private get durationClips(): Clip[] { return this._durationClips ||= this.durationClipsInitialize }
  private get durationClipsInitialize(): Clip[] {
    const { mash } = this.args
    const { frames } = mash
    if (isPositive(frames)) return []
    
    const { clips } = mash
    const options: IntrinsicOptions = { duration: true }
    const zeroClips = clips.filter(clip => !clip.intrinsicsKnown(options))
    return zeroClips
  }

  get endTime(): Time | undefined {
    if (this.outputType === ImageType) return 

    return this.args.endTime || this.args.mash.endTime
  }

  get durationGraphFiles(): GraphFiles {
    const clips = this.durationClips
    const options: IntrinsicOptions = { duration: true }
    const files = clips.flatMap(clip => clip.intrinsicGraphFiles(options))
    const unique = new Set(files)
    return [...unique]
  }

  // private _filterGraphs?: FilterGraphsthis._filterGraphs =
  get filterGraphs() {
    const { mash } = this.args
    const args = filterGraphsArgs(mash, this.filterGraphsOptions)
    return filterGraphsInstance(args)
  }

  get filterGraphsOptions(): FilterGraphsOptions {
    const { timeRange, videoRate, outputSize: size } = this
    const filterGraphsOptions: FilterGraphsOptions = {
      time: timeRange, videoRate, size, 
      avType: this.avTypeNeededForClips
    }
    return filterGraphsOptions
  }

  private get mashDurationPromise(): Promise<void> {
    return this.loadClipsPromise(this.durationClips)
  }

  private loadClipsPromise(clips: Clips): Promise<void> {
    if (!clips.length) return Promise.resolve()
    
    const { quantize } = this.args.mash
    const shared = {
      quantize, audible: true, visible: true, editing: false, streaming: false,
    }
    const promises = clips.map(clip => {
      const time = clip.timeRange(quantize)
      const args: PreloadArgs = { ...shared, time, clipTime: time }
      return clip.loadPromise(args)
    })
    return Promise.all(promises).then(EmptyMethod)
  }

  get outputSize(): Size {
    const { width, height } = this.args.commandOutput
    if (!(width && height)) {
      if (this.avType === AVType.Audio) return { width: 0, height: 0 }

      // console.error(this.constructor.name, "outputSize", this.args.commandOutput)
      return errorThrow(ErrorName.OutputDuration)
    }
    return { width, height }
  }

  get outputType(): EncodeType { return this.args.commandOutput.outputType }

  renderingDescriptionPromise(renderingResults?: RenderingResult[]): Promise<RenderingDescription> {
    // console.log(this.constructor.name, "renderingDescriptionPromise")

    let promise = this.mashDurationPromise
    promise = promise.then(() => { 
      this.assureClipFrames() 
    })

    promise = promise.then(() => {
      return this.filterGraphs.loadCommandFilesPromise 
    })
    return promise.then(() => {
      this.assureClipFrames()

      const { commandOutput } = this
      const renderingDescription: RenderingDescription = { commandOutput }
      const avType = this.avTypeNeededForClips
      const { filterGraphs } = this
      // console.log(this.constructor.name, "renderingDescriptionPromise avType", avType)
      if (avType !== AVType.Audio) {
        const { filterGraphsVisible } = filterGraphs
        const visibleCommandDescriptions = filterGraphsVisible.map(filterGraph => {
          const { commandInputs: inputs, commandFilters, duration } = filterGraph
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

  get startTime(): Time {
    const { mash, startTime } = this.args
    const { quantize, frame, frames } = mash
    if (this.outputType === ImageType) {
      if (frames < 0) return timeFromArgs(0, quantize)

      return mash.timeRange.positionTime(0, 'ceil')
    }
    if (startTime) return startTime

    return timeFromArgs(frame, quantize)
  }


  get timeRange(): Time { 
    const { startTime } = this
    if (this.outputType === ImageType) return startTime

    return timeRangeFromTimes(startTime, this.endTime) 
  }

  get videoRate(): number { return this.args.commandOutput.videoRate || 0 }

  private get clipsLackingSize(): Clips {
    const { timeRange, args } = this
    const { mash } = args
    const clips = mash.clipsInTimeOfType(timeRange, AVType.Video)
    const options: IntrinsicOptions = { size: true }
    return clips.filter(clip => !clip.intrinsicsKnown(options))
  }


  private get visibleGraphFiles(): GraphFiles {
    const options: IntrinsicOptions = { size: true }
    const files: GraphFiles = this.clipsLackingSize.flatMap(clip => 
      clip.intrinsicGraphFiles(options)
    )
    return files
  }

}
