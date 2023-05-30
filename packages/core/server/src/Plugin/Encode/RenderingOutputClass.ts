
import { 
  AVType, 
  isPositive, IntrinsicOptions, Time, 
  GraphFiles, 

  ServerClips, EmptyFunction, Size, 
  EncodingType, timeFromArgs, timeRangeFromTimes,
  InstanceCacheArgs,
  TypeVideo,
  TypeAudio,
  TypeImage,
  errorThrow,
  ErrorName,
  AVTypeAudio,
  AVTypeBoth,
  AVTypeVideo,
  sizeCopy,
  sizeAboveZero,
  VideoOutputOptions,
  isAboveZero,
  assertPositive, isAudibleAsset
} from "@moviemasher/lib-core"
import { CommandDescription, RenderingDescription, RenderingOutput, RenderingOutputArgs } from "./Encode.js"
import { FilterGraphsOptions } from "./FilterGraphs/FilterGraphs.js"
import { filterGraphsArgs, filterGraphsInstance } from "./FilterGraphs/FilterGraphsFactory.js"

export class RenderingOutputClass implements RenderingOutput {
  constructor(public args: RenderingOutputArgs) {}

  protected assureClipFrames(): void {
    const { durationClips, args } = this
    const { quantize } = args.mash
    durationClips.forEach(clip => {
      const { content } = clip
      const { asset: definition } = content
      if (isAudibleAsset(definition)) {
        const frames = definition.frames(quantize)
        // console.log(this.constructor.name, "assureClipFrames", clip.label, frames, definition.duration)
        if (frames) clip.frames = frames
      }
    })
  }

  get avType() { 
    switch (this.encodingType) {
      case TypeAudio: return AVTypeAudio
      // case FontType:
      // case SequenceType: 
      case TypeImage: return AVTypeVideo
      case TypeVideo: return AVTypeBoth 
    }
  }

  get avTypeNeededForClips(): AVType {
    const { avType } = this
    if (avType !== AVTypeBoth) return avType

    const renderingClips = this.args.mash.clipsInTimeOfType(this.timeRange, this.avType)
    const types = new Set<AVType>()
    renderingClips.forEach(renderingClip => {
      if (renderingClip.audible) types.add(AVTypeAudio)
      if (renderingClip.visible) types.add(AVTypeVideo)
    })
    // console.log(this.constructor.name, "avTypeNeededForClips", types)
    if (types.size === 2) return avType
    const [type] = types
    return type
  }


  get duration(): number { 
    if (this.encodingType === TypeImage) return 0
    
    return this.timeRange.lengthSeconds 
  }

  private _durationClips?: ServerClips
  private get durationClips(): ServerClips { return this._durationClips ||= this.durationClipsInitialize }
  private get durationClipsInitialize(): ServerClips {
    const { mash } = this.args
    const { frames } = mash
    if (isPositive(frames)) return []
    
    const { clips } = mash
    const options: IntrinsicOptions = { duration: true }
    const zeroClips = clips.filter(clip => !clip.intrinsicsKnown(options))
    return zeroClips
  }

  get endTime(): Time | undefined {
    if (this.encodingType === TypeImage) return 

    const { args } = this
    const { endTime, mash } = args
    // console.log(this.constructor.name, "endTime", mash.tracks)
    return endTime || mash.endTime
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

  private loadClipsPromise(clips: ServerClips): Promise<void> {
    if (!clips.length) return Promise.resolve()
    
    const { quantize } = this.args.mash
    const shared = {
      quantize, audible: true, visible: true, 
    }
    const promises = clips.map(clip => {
      const time = clip.timeRange
      const args: InstanceCacheArgs = { ...shared, time, clipTime: time }
      return clip.clipCachePromise(args)
    })
    return Promise.all(promises).then(EmptyFunction)
  }

  protected get outputOptions() { return this.args.outputOptions }

  get outputSize(): Size {
    const { outputOptions } = this
    if (sizeAboveZero(outputOptions)) return sizeCopy(outputOptions)

    if (this.avType === AVTypeAudio) return { width: 0, height: 0 }

    return errorThrow(ErrorName.OutputDimensions)
  }


  get encodingType(): EncodingType { return this.args.encodingType }

  renderingDescriptionPromise(): Promise<RenderingDescription> {
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

      const { outputOptions, encodingType } = this
      const renderingDescription: RenderingDescription = { 
        outputOptions, encodingType
       }
      const avType = this.avTypeNeededForClips
      const { filterGraphs } = this
      // console.log(this.constructor.name, "renderingDescriptionPromise avType", avType)
      if (avType !== AVTypeAudio) {
        const { filterGraphsVisible } = filterGraphs
        const visibleCommandDescriptions = filterGraphsVisible.map(filterGraph => {
          const { commandInputs: inputs, commandFilters, duration } = filterGraph
          const commandDescription: CommandDescription = { inputs, commandFilters, duration, avType: AVTypeVideo }
        // console.log(this.constructor.name, "renderingDescriptionPromise inputs, commandFilters", inputs, commandFilters)
          return commandDescription
        })
        renderingDescription.visibleCommandDescriptions = visibleCommandDescriptions
      }
      if (avType !== AVTypeVideo) {
        const { filterGraphAudible, duration } = filterGraphs
        if (filterGraphAudible) {
          const { commandFilters, commandInputs: inputs } = filterGraphAudible
         
          const commandDescription: CommandDescription = {
            inputs, commandFilters, duration, avType: AVTypeAudio
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
    if (this.encodingType === TypeImage) {
      if (frames < 0) return timeFromArgs(0, quantize)

      return mash.timeRange.positionTime(0, 'ceil')
    }
    if (startTime) return startTime
    assertPositive(frame, 'frame')

    return timeFromArgs(frame, quantize)
  }


  get timeRange(): Time { 
    const { startTime } = this
    if (this.encodingType === TypeImage) return startTime

    const { endTime } = this
    // console.log(this.constructor.name, "timeRange", startTime, endTime)
    return timeRangeFromTimes(startTime, endTime) 
  }

  get videoRate(): number { 
    const { outputOptions } = this
    const { videoRate } = outputOptions as VideoOutputOptions

    return isAboveZero(videoRate) ? videoRate : 0
}

  // private get clipsLackingSize(): ServerClips {
  //   const { timeRange, args } = this
  //   const { mash } = args
  //   const clips = mash.clipsInTimeOfType(timeRange, AVTypeVideo)
  //   const options: IntrinsicOptions = { size: true }
  //   return clips.filter(clip => !clip.intrinsicsKnown(options))
  // }


  // private get visibleGraphFiles(): GraphFiles {
  //   const options: IntrinsicOptions = { size: true }
  //   const files: GraphFiles = this.clipsLackingSize.flatMap(clip => 
  //     clip.intrinsicGraphFiles(options)
  //   )
  //   return files
  // }
}
