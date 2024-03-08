
import type { EncodeCommands, PrecodeCommands, ServerMashDescription, AVType, AbsolutePath, AssetCacheArgs, Clips, DataOrError, DecodeArgs, IntrinsicOptions, ProbingOptions, Time, TimeRange, Times, SyncFunction } from '@moviemasher/shared-lib/types.js'
import type { ServerMashDescriptionArgs, ServerSegmentDescription, ServerSegmentDescriptionArgs } from '../types.js'
import type { AudibleCommandFilterArgs, AudioCommandFileArgs, Clip, CommandFiles, CommandFilter, CommandFilters, CommandInput, CommandInputRecord, EncodeDescription, MashAsset, PrecodeDescription, RawType, ServerPromiseArgs, Size, VideoCommandFileOptions, VideoCommandFilterArgs } from '@moviemasher/shared-lib/types.js'

import { MashDescriptionClass } from '@moviemasher/shared-lib/base/description.js'
import { $AUDIO, $BOTH, $COLOR, $DECODE, $IMAGE, $JSON, $PROBE, $VIDEO, ASSET_DURATION, ERROR, MOVIE_MASHER, PROBING_TYPES, isDefiniteError, isProbing, namedError, promiseNumbers, typeOutputOptions } from '@moviemasher/shared-lib/runtime.js'
import { isAboveZero, isPositive } from '@moviemasher/shared-lib/utility/guard.js'
import { assertAboveZero, assertDefined, isDropResource } from '@moviemasher/shared-lib/utility/guards.js'
import { assertTimeRange, isTimeRange, timeRangeFromArgs } from '@moviemasher/shared-lib/utility/time.js'
import { isServerClip } from '../utility/guard.js'
import { RGBA_BLACK_ZERO, arrayLast, assertAsset, errorThrow, idGenerate, sortByTrack, sortByType } from '@moviemasher/shared-lib/runtime.js'
import { assertTrue } from '@moviemasher/shared-lib/utility/guards.js'
import { timeRangeFromTime } from '@moviemasher/shared-lib/utility/time.js'

const BACKCOLOR = 'BACKCOLOR'

const SILENCE = 'SILENCE'

export class ServerSegmentDescriptionClass implements ServerSegmentDescription {
  constructor(protected args: ServerSegmentDescriptionArgs) {}

  declare assetType: RawType

  get assetsServerPromise(): Promise<DataOrError<number>> {
    // raw assets are already cached on disk, so write other command files
    const { commandFiles, time, visible, size } = this
    const args: ServerPromiseArgs = { visible, audible: !visible, time, size, commandFiles }
    const promises = commandFiles.map(commandFile => {
      const { asset } = commandFile
      assertAsset(asset)

      // console.log(this.constructor.name, 'assetsServerPromise', asset.label, commandFile.type)
      return asset.commandFilePromise(args, commandFile)
    })
    return promiseNumbers(promises)
  }
  get audible(): boolean { return this.avType === $AUDIO }

  get visible(): boolean { return this.avType === $VIDEO }

  get avType(): AVType { 
    switch (this.assetType) {
      case $AUDIO: return $AUDIO
      case $IMAGE:
      case $VIDEO: return $VIDEO
    }
  }

  get clip(): Clip | undefined { return this.args.clip }
  
  private _clips?: Clips

  protected get clips() { return this._clips ||= this.clipsInitialize }
  
  private get clipsInitialize() {
    const { time, mash, avType, clip } = this
    return clip ? [clip] : mash.clipsInTimeOfType(time, avType).sort(sortByTrack)
  }

  private _commandFiles?: CommandFiles

  protected get commandFiles(): CommandFiles {
    return this._commandFiles ||= this.commandFilesInitialize
  }

  protected get commandFilesInitialize(): CommandFiles {
    return []
  }

  get encodeDescription(): EncodeDescription { 
    const { inputs: inputsById, filters: commandFilters, duration, avType } = this
    return { inputsById, commandFilters, duration, avType }
  }

  get duration(): number { 
    const { time } = this
    return isTimeRange(time) ? time.lengthSeconds : 0
  }

  protected get encodePath(): AbsolutePath { return this.mashDescription.encodePath }

  get filters(): CommandFilters { 
    return errorThrow(ERROR.Unimplemented)
  }

  _id?: string
  get id() { return this._id ||= idGenerate(this.assetType)}
  
  get inputCommandFiles(): CommandFiles { 
    return this.commandFiles.filter(file => file.avType) 
  }

  get inputs(): CommandInputRecord {
    const entries = this.inputCommandFiles.map(commandFile => {
      const { path, inputId, file, inputOptions, outputOptions, avType } = commandFile
      const source = path || file
      assertDefined(avType)

      const input: CommandInput = { avType, source, inputOptions, outputOptions }
      return [inputId, input]
    })
    return Object.fromEntries(entries)
  }
  
  protected get mash(): MashAsset { return this.mashDescription.mash }

  protected get mashDescription(): ServerMashDescription { return this.args.mashDescription }
  
  get precodeDescription(): PrecodeDescription { 
    const { inputs: inputsById, filters: commandFilters, duration, clip } = this
    assertDefined(clip)
    return { inputsById, commandFilters, duration, clip }
  }

  protected get size(): Size { return this.mashDescription.size }

  get time(): Time { return this.args.time }


}

export class AudioServerSegmentDescriptionClass extends ServerSegmentDescriptionClass {
  constructor(public args: ServerSegmentDescriptionArgs) {
    super(args)
    assertTrue(isAboveZero(this.audioRate), 'audioRate')
  }
  
  assetType = $AUDIO 

  private get audioRate(): number { return this.mashDescription.audioRate }

  protected override get commandFilesInitialize(): CommandFiles {
    // console.log(this.constructor.name, 'commandFilesInitialize')
    const { time, audioRate, clips } = this
    const commandFiles = clips.filter(isServerClip).flatMap(clip => {
      const clipTime = clip.timeRange
      const chainArgs: AudioCommandFileArgs = { 
        time, audioRate, clipTime
      }
      return clip.audioCommandFiles(chainArgs)
    })
    return commandFiles
  }

  private get commandFilterAudible(): CommandFilter {
    const { duration } = this
    const silenceCommandFilter: CommandFilter = {
      ffmpegFilter: 'aevalsrc',
      options: { exprs: 0, duration },
      inputs: [], outputs: [SILENCE]
    }
    if (duration) silenceCommandFilter.options.duration = duration
    return silenceCommandFilter
  }

  override get filters(): CommandFilters { 
    const filters: CommandFilters = []
    const { 
      time, clips, duration, audioRate, commandFiles
    } = this
    const chainArgs: AudibleCommandFilterArgs = { 
      commandFiles, duration,
      audioRate, time, 
      chainInput: '', clipTime: timeRangeFromTime(time), track: 0
    }
   
    filters.push(this.commandFilterAudible)
    chainArgs.chainInput = SILENCE
    const { length } = clips
    clips.filter(isServerClip).forEach((clip, index) => {
      chainArgs.clipTime = clip.timeRange
      chainArgs.track = index
      filters.push(...clip.audioCommandFilters(chainArgs))
    
      const lastFilter = arrayLast(filters)
      if (index < length - 1 ) {
        if (!lastFilter.outputs.length) lastFilter.outputs.push(idGenerate('clip'))
      }
      chainArgs.chainInput = arrayLast(lastFilter.outputs)
    })
    return filters
  }

  get time(): TimeRange { return super.time as TimeRange }

}

export class ImageServerSegmentDescriptionClass extends ServerSegmentDescriptionClass {
  constructor(public args: ServerSegmentDescriptionArgs) {
    super(args)
  }
  assetType = $IMAGE
}

export class VideoServerSegmentDescriptionClass extends ServerSegmentDescriptionClass {
  constructor(public args: ServerSegmentDescriptionArgs) {
    super(args)
    
    assertTrue(isAboveZero(this.videoRate), 'videoRate')
  }

  assetType = $VIDEO

  private get background(): string { return this.mashDescription.background }

  protected get commandFilesInitialize(): CommandFiles {
    // console.log(this.constructor.name, 'commandFilesInitialize')
    const { time, videoRate, size: outputSize, clips, encodePath } = this
    const files = clips.filter(isServerClip).flatMap(clip => {
      const options: VideoCommandFileOptions = { 
        time, outputSize, videoRate, encodePath
      }
      return clip.videoCommandFiles(options)
    })
    return files.sort(sortByType)
  }


  private get commandFilterVisible(): CommandFilter {
    const { duration, videoRate: rate, background, size } = this
    // console.log(this.constructor.name, this.id, 'commandFilterVisible size', size)
    const color = background || RGBA_BLACK_ZERO
    const commandFilter: CommandFilter = {
      ffmpegFilter: 'color',
      options: { color, rate, size: `${size.width}x${size.height}` },
      inputs: [], outputs: [BACKCOLOR]
    }
    if (duration) commandFilter.options.duration = duration
    return commandFilter
  }

  override get filters(): CommandFilters { 
    const { time, size, clips, duration, videoRate, encodePath, commandFiles } = this
    
    const filters: CommandFilters = [this.commandFilterVisible]
    const { length } = clips
    const chainArgs: VideoCommandFilterArgs = { 
      commandFiles, duration, videoRate, time, outputSize: size, encodePath,
      chainInput: BACKCOLOR, clipTime: timeRangeFromTime(time), track: 0
    }
    clips.filter(isServerClip).forEach((clip, index) => {
      chainArgs.clipTime = clip.timeRange
      chainArgs.track = index
      filters.push(...clip.videoCommandFilters(chainArgs))
      const lastFilter = arrayLast(filters)
      if (index < length - 1 && !lastFilter.outputs.length) {
        lastFilter.outputs.push(idGenerate('clip'))
      }
      chainArgs.chainInput = arrayLast(lastFilter.outputs)
    })
    return filters
  }

  get time(): TimeRange { return super.time as TimeRange }

  private get videoRate(): number { return this.mashDescription.videoRate }

}


export class ServerMashDescriptionClass extends MashDescriptionClass implements ServerMashDescription {
  constructor(public args: ServerMashDescriptionArgs) { super(args) }

  private get assetCacheArgs(): AssetCacheArgs {
    const { quantize } = this
    const { avType } = this
    const args: AssetCacheArgs = { quantize }
    if (avType !== $AUDIO) args.visible = true
    if (avType !== $VIDEO) args.audible = true
    return args
  }

  private assetsServerPromise(segments: ServerSegmentDescription[]): Promise<DataOrError<number>> {
    // console.log(this.constructor.name, 'assetsServerPromise')
    // raw assets are already cached
   
    // console.log(this.constructor.name, 'assetsServerPromise', segments.length)
    const promises = segments.map(segment => segment.assetsServerPromise)
    return promiseNumbers(promises)
  }

  get audioRate(): number { return Number(this.outputOptions($AUDIO).audioRate) }

  private _audibleSegmentDescriptions?: ServerSegmentDescription[] 
  get audibleSegmentDescriptions(): ServerSegmentDescription[] {
    const { _audibleSegmentDescriptions } = this
    if (_audibleSegmentDescriptions) return _audibleSegmentDescriptions

    const descriptions: ServerSegmentDescription[] = []
    const { assetType, mute } = this

    switch (assetType) {
      case $VIDEO: if (mute) break // otherwise fall through to $AUDIO
      case $AUDIO: {
        const { timesAudio } = this
        timesAudio.forEach(time => {
          const args = this.segmentArgs(time)
          descriptions.push(new AudioServerSegmentDescriptionClass(args))
        })
        break
      }
    }
    return this._audibleSegmentDescriptions = descriptions
  }

  private get avTypeNeededForClips(): AVType {
    const { avType } = this
    if (avType !== $BOTH) return avType

    const { mash, time } = this
    const renderingClips = mash.clipsInTimeOfType(time, avType).filter(isServerClip)
    const types = new Set<AVType>()
    renderingClips.forEach(renderingClip => {
      if (renderingClip.audible) types.add($AUDIO)
      if (renderingClip.visible) types.add($VIDEO)
    })
    if (types.size === 2) return avType

    const [type] = types
    return type
  }

  get background(): string { return this.args.background || String(this.mash.value($COLOR)) }

  private async cachePrecodePromise(): Promise<DataOrError<number>> {
    const cacheOrError = await this.cachePromise()
    if (isDefiniteError(cacheOrError)) return cacheOrError

    const { precodeSegmentDescriptions } = this
    if (!precodeSegmentDescriptions.length) return namedError(ERROR.Unavailable)

    for (const segment of precodeSegmentDescriptions) {
      const { time, audible, visible } = segment
      const cacheArgs: AssetCacheArgs = { time, audible, visible }
      const assetCacheOrError = await this.mash.assetCachePromise(cacheArgs)
      if (isDefiniteError(assetCacheOrError)) return assetCacheOrError
    }
    return await this.assetsServerPromise(precodeSegmentDescriptions)

  }

  private async cacheEncodePromise(): Promise<DataOrError<number>> {
    const cacheOrError = await this.cachePromise()
    if (isDefiniteError(cacheOrError)) return cacheOrError
// cache everything within our output time
    const { avTypeNeededForClips: avType, time } = this
    const { mash } = this
    const cacheArgs: AssetCacheArgs = { 
      time, audible: avType !== $VIDEO, visible: avType !== $AUDIO 
    }
    // console.log(this.constructor.name, 'mashCommandsPromise', cacheArgs)
    const assetCacheOrError = await mash.assetCachePromise(cacheArgs)
    if (isDefiniteError(assetCacheOrError)) return assetCacheOrError
    const segments = [
      ...this.visibleSegmentDescriptions, ...this.audibleSegmentDescriptions
    ]
    return await this.assetsServerPromise(segments)
  }

  async cachePromise(): Promise<DataOrError<number>> { 
    // cache all files that dont' have intrinsic size or duration
    const intrinsicsOrError = await this.intrinsicsPromise
    if (isDefiniteError(intrinsicsOrError)) return intrinsicsOrError

    // make sure all clips have duration, probing if needed
    return await this.probingsPromise()
  }

  get duration(): number { 
    const { time } = this
    return isTimeRange(time) ? time.lengthSeconds : 0 
  }

  async encodeCommandsPromise(): Promise<DataOrError<EncodeCommands>> {
    const orError = await this.cacheEncodePromise()
    if (isDefiniteError(orError)) return orError

    return Promise.resolve({ data: this.encodeMashCommands })
  }

  get encodeMashCommands(): EncodeCommands {
    const { avType } = this
    const commands: EncodeCommands = { 
      outputOptions: this.outputOptions(), encodingType: this.assetType
    }
    if (avType !== $AUDIO) {
      const { visibleSegmentDescriptions: visible } = this
      commands.visibleDescriptions = visible.map(segment => segment.encodeDescription)
    }
    if (avType !== $VIDEO) {
      const { audibleSegmentDescriptions: audible } = this
      commands.audibleDescriptions = audible.map(segment => segment.encodeDescription)
    }
    return commands
  }

  get encodePath(): AbsolutePath { return this.args.encodePath }

  private get framesUnknownClips(): Clips {
    return this.mash.clips.filter(clip => !isPositive(clip.frames))
  }

  private get intrinsicOptions(): IntrinsicOptions {
    const { avType } = this
    const options: IntrinsicOptions = {}
    if (avType !== $AUDIO) options.size = true
    if (avType !== $VIDEO) options.duration = true
    return options
  }

  get intrinsicsPromise(): Promise<DataOrError<number>> {
    const { intrinsicsUnknownClips } = this
    if (!intrinsicsUnknownClips.length) return Promise.resolve({ data: 0 })

    const args = this.assetCacheArgs
    const unknownPromises = intrinsicsUnknownClips.flatMap(clip => {
      const { content, container } = clip
      const clipPromises = [content.asset.assetCachePromise(args)]
      if (container) {
        clipPromises.push(container.asset.assetCachePromise(args))
      }
      return clipPromises
    })
    return promiseNumbers(unknownPromises)
  }

  private _intrinsicsUnknownClips?: Clips

  private get intrinsicsUnknownClips(): Clips { 
    return this._intrinsicsUnknownClips ||= this.intrinsicsUnknownClipsInitialize 
  }

  private get intrinsicsUnknownClipsInitialize(): Clips {
    const { clips } = this.mash
    return clips.filter(clip => !clip.intrinsicsKnown(this.intrinsicOptions))
  }

  // override get mash(): MashAsset { return this.args.mash }

  private get mute(): boolean { return !!this.args.mute }

  get needsPrecoding(): boolean { return !!this.precodeSegmentDescriptions.length }

  private outputOptions(type?: AVType) { 
    const { outputOptions: base = {} } = this.args
    const avType = type || this.avType
    const orBase = avType === $VIDEO ? base : typeOutputOptions($AUDIO, base)
    return avType === $AUDIO ? orBase : typeOutputOptions($VIDEO, orBase)
  }

  async precodeCommandsPromise(): Promise<DataOrError<PrecodeCommands>> {
    const orError = await this.cachePrecodePromise()
    if (isDefiniteError(orError)) return orError


    const { precodeCommands } = this
    if (!precodeCommands) return namedError(ERROR.Unavailable)

    return { data: precodeCommands }
  }

  private _precodeSegmentDescriptions?: ServerSegmentDescription[]

  get precodeSegmentDescriptions(): ServerSegmentDescription[] {
    const { _precodeSegmentDescriptions } = this
    if (_precodeSegmentDescriptions) return _precodeSegmentDescriptions

    // find the clips that need precoding
    const { mash, time: timeRange } = this
    const clips = mash.clipsInTimeOfType(timeRange, $VIDEO).filter(isServerClip)
    const prerenderClips = clips.filter(clip => clip.requiresPrecoding)
    return this._precodeSegmentDescriptions = prerenderClips.map(clip => {
      const args = this.segmentArgs(clip.timeRange)
      args.clip = clip
      return new VideoServerSegmentDescriptionClass(args)
    })
  }

  private get precodeCommands(): PrecodeCommands | undefined {
    const { avType, precodeSegmentDescriptions: segments } = this
    if (avType === $AUDIO || !segments.length) return

    const commands: PrecodeCommands = { 
      outputOptions: this.outputOptions($VIDEO), 
      commandDescriptions: segments.map(segment => segment.precodeDescription),
      times: this.timesVideo
    }
    return commands
  }
  
  private probingsPromise(): Promise<DataOrError<number>> {
    const { intrinsicsUnknownClips } = this
    const quantize = this.mash.value('quantize')
    assertAboveZero(quantize, 'assureClipFrames quantize')

    const promises: Promise<DataOrError<number>>[] = intrinsicsUnknownClips.flatMap(clip => {
      const { content } = clip
      const { asset } = content
      const { resource } = asset
      if (!isDropResource(resource)) return []

      const decodeOptions: ProbingOptions = { types: PROBING_TYPES }
      const args: DecodeArgs = { resource, type: $PROBE, options: decodeOptions}
      const promise = MOVIE_MASHER.promise(args, $DECODE)

   
      const framesPromise: Promise<DataOrError<number>> = promise.then(orError => {
        if (isDefiniteError(orError)) return orError

        const { data: probing } = orError
        if (!isProbing(probing)) return namedError(ERROR.Syntax, $JSON) 

        asset.decodings.push(probing)
        return { data: 1 }
      })
      return [framesPromise]
    })
    return promiseNumbers(promises).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { framesUnknownClips } = this      
      framesUnknownClips.forEach(clip => {
        clip.resetTiming(undefined, quantize)
        if (isAboveZero(clip.frames)) return
  
        clip.frames = Math.floor(ASSET_DURATION * quantize)
      })
      return orError
    })
  }

  private segmentArgs(time: Time): ServerSegmentDescriptionArgs {
    assertTimeRange(time)
    return { time, mashDescription: this }
  }

  private get timeRange(): TimeRange {
    const { time } = this
    assertTimeRange(time)
    return time
  }

  private get timesAudio(): Times {
    const times: Times = []
    const { mash, timeRange } = this
    // console.log(this.constructor.name, 'timesAudio', timeRange)
    const clips = mash.clipsInTimeOfType(timeRange, $AUDIO).filter(isServerClip)
    // console.log(this.constructor.name, 'timesAudio clips', clips.length)

    const unmutedClips = clips.filter(clip => clip.canBeMuted && !clip.muted)
    // console.log(this.constructor.name, 'timesAudio unmuted', unmutedClips.length)
    if (unmutedClips.length) times.push(timeRange)
    return times
  }

  private get timesVideo(): Times {
    const { quantize, mash, timeRange } = this
    const clips = mash.clipsInTimeOfType(timeRange, $VIDEO).filter(isServerClip)
    const { length } = clips
    switch (length) {
      case 0: return []
      case 1: return [timeRange]
    }
    
    const start = timeRange.scale(this.quantize, 'floor')
    const end = start.endTime

    const frames = new Set<number>()
    clips.forEach(clip => {
      frames.add(Math.max(clip.frame, start.frame))
      frames.add(Math.min(clip.frame + clip.frames, end.frame))
    })
    const uniqueFrames = [...frames].sort((a, b) => a - b)
    let frame = uniqueFrames.shift()!
    const unique = uniqueFrames.map(uniqueFrame => {
      const range = timeRangeFromArgs(frame, quantize, uniqueFrame - frame)
      frame = uniqueFrame
      return range
    })

    // console.log(this.constructor.name, 'timesVideo', unique)
    return unique
  }

  get videoRate(): number { return Number(this.outputOptions($VIDEO).videoRate) }
  
  private _visibleSegmentDescriptions?: ServerSegmentDescription[]
  get visibleSegmentDescriptions(): ServerSegmentDescription[]  {
    const { _visibleSegmentDescriptions } = this
    if (_visibleSegmentDescriptions) return _visibleSegmentDescriptions

    const descriptions: ServerSegmentDescription[] = []
    const { assetType } = this

    switch (assetType) {
      case $IMAGE: {
        const args = this.segmentArgs(this.time)
        descriptions.push(new ImageServerSegmentDescriptionClass(args))
        break
      }
      case $VIDEO: {
        const { timesVideo } = this
        timesVideo.forEach(time => {
          const args = this.segmentArgs(time)
          descriptions.push(new VideoServerSegmentDescriptionClass(args))
        })
      }
    }
    return this._visibleSegmentDescriptions = descriptions
  }
}

export const mashViewServerFunction:SyncFunction<ServerMashDescription, ServerMashDescriptionArgs> = args => {
  assertDefined(args)
  
  return new ServerMashDescriptionClass(args)
}