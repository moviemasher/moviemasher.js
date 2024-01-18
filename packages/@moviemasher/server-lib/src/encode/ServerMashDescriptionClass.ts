
import type { AVType, AbsolutePath, AssetCacheArgs, AudioOutputOptions, DataOrError, Decoding, IntrinsicOptions, Time, TimeRange, Times, VideoOutputOptions } from '@moviemasher/shared-lib/types.js'
import type { EncodeDescription, EncodeCommands, PrecodeCommands, ServerMashDescription, ServerMashDescriptionArgs, ServerSegmentDescription, ServerSegmentDescriptionArgs } from '../types.js'

import { MashDescriptionClass } from '@moviemasher/shared-lib/base/description.js'
import { ASSET_DURATION, AUDIO, BOTH, ERROR, IMAGE, JSON, MOVIEMASHER, PROBE, PROBING_TYPES, VIDEO, assertTyped, errorPromise, isDefiniteError, jsonParse, namedError, typeOutputOptions } from '@moviemasher/shared-lib/runtime.js'
import { assertAboveZero, isAboveZero, isPositive, isRequestable } from '@moviemasher/shared-lib/utility/guards.js'
import { promiseNumbers } from '@moviemasher/shared-lib/utility/request.js'
import { assertTimeRange, isTimeRange, timeRangeFromArgs } from '@moviemasher/shared-lib/utility/time.js'
import { EventReleaseServerManagedAssets, EventServerDecode } from '../runtime.js'
import { ServerClips, ServerMashAsset } from '../type/ServerMashTypes.js'
import { AudioServerSegmentDescriptionClass, ImageServerSegmentDescriptionClass, VideoServerSegmentDescriptionClass } from './ServerSegmentDescriptionClass.js'

export class ServerMashDescriptionClass extends MashDescriptionClass implements ServerMashDescription {
  constructor(public args: ServerMashDescriptionArgs) {
    super(args)
  }
  private get assetCacheArgs(): AssetCacheArgs {
    const { quantize } = this.args.mash
    const { avType } = this
    const args: AssetCacheArgs = { quantize }
    if (avType !== AUDIO) args.visible = true
    if (avType !== VIDEO) args.audible = true
    return args
  }

  get audioRate(): number { return Number(this.outputOptions(AUDIO).audioRate) }

  private _audibleSegmentDescriptions?: ServerSegmentDescription[] 
  get audibleSegmentDescriptions(): ServerSegmentDescription[] {
    const { _audibleSegmentDescriptions } = this
    if (_audibleSegmentDescriptions) return _audibleSegmentDescriptions

    const descriptions: ServerSegmentDescription[] = []
    const { assetType, mute } = this

    switch (assetType) {
      case VIDEO: if (mute) break // otherwise fall through to AUDIO
      case AUDIO: {
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
    if (avType !== BOTH) return avType

    const renderingClips = this.args.mash.clipsInTimeOfType(this.time, avType)
    const types = new Set<AVType>()
    renderingClips.forEach(renderingClip => {
      if (renderingClip.audible) types.add(AUDIO)
      if (renderingClip.visible) types.add(VIDEO)
    })
    if (types.size === 2) return avType

    const [type] = types
    return type
  }

  get background(): string { return this.args.background || this.mash.color }

  get duration(): number { 
    const { time } = this
    return isTimeRange(time) ? time.lengthSeconds : 0 
  }

  get encodePath(): AbsolutePath { return this.args.encodePath }

  private get framesUnknownClips(): ServerClips {
    return this.args.mash.clips.filter(clip => !isPositive(clip.frames))
  }

  private get intrinsicOptions(): IntrinsicOptions {
    const { avType } = this
    const options: IntrinsicOptions = {}
    if (avType !== AUDIO) options.size = true
    if (avType !== VIDEO) options.duration = true
    return options
  }

  private get intrinsicsPromise(): Promise<DataOrError<number>> {
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

  private _intrinsicsUnknownClips?: ServerClips

  private get intrinsicsUnknownClips(): ServerClips { 
    return this._intrinsicsUnknownClips ||= this.intrinsicsUnknownClipsInitialize 
  }

  private get intrinsicsUnknownClipsInitialize(): ServerClips {
    const { clips } = this.args.mash
    return clips.filter(clip => !clip.intrinsicsKnown(this.intrinsicOptions))
  }

  private assetsServerPromise(segments: ServerSegmentDescription[]): Promise<DataOrError<number>> {
    // console.log(this.constructor.name, 'assetsServerPromise')
    // raw assets are already cached
   
    // console.log(this.constructor.name, 'assetsServerPromise', segments.length)
    const promises = segments.map(segment => segment.assetsServerPromise)
    return promiseNumbers(promises)
  }

  override get mash(): ServerMashAsset { return this.args.mash }

  private async cache(): Promise<DataOrError<number>> {
    // cache all files that dont' have intrinsic size or duration
    const intrinsicsOrError = await this.intrinsicsPromise
    if (isDefiniteError(intrinsicsOrError)) return intrinsicsOrError

    // make sure all clips have duration, probing if needed
    return await this.probingsPromise()
  }

  private async cachePrecodePromise(): Promise<DataOrError<number>> {
    const cacheOrError = await this.cache()
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
    const cacheOrError = await this.cache()
    if (isDefiniteError(cacheOrError)) return cacheOrError
// cache everything within our output time
    const { avTypeNeededForClips: avType, args, time } = this
    const { mash } = args
    const cacheArgs: AssetCacheArgs = { 
      time, audible: avType !== VIDEO, visible: avType !== AUDIO 
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
    const orError = await this.cache()
    if (isDefiniteError(orError)) {
      MOVIEMASHER.eventDispatcher.dispatch(new EventReleaseServerManagedAssets())
    }
    return orError
  }

  async encodeCommandsPromise(): Promise<DataOrError<EncodeCommands>> {
    const orError = await this.cacheEncodePromise()
    if (isDefiniteError(orError)) return orError

    return Promise.resolve({ data: this.encodeMashCommands })
  }

  async precodeCommandsPromise(): Promise<DataOrError<PrecodeCommands>> {
    const orError = await this.cachePrecodePromise()
    if (isDefiniteError(orError)) return orError


    const { precodeMashCommands } = this
    if (!precodeMashCommands) return namedError(ERROR.Unavailable)

    return { data: precodeMashCommands }
  }

  get encodeMashCommands(): EncodeCommands {
    const { avType } = this
    const commands: EncodeCommands = { 
      outputOptions: this.outputOptions(), encodingType: this.assetType
    }
    if (avType !== AUDIO) {
      const { visibleSegmentDescriptions: visible } = this
      commands.visibleDescriptions = visible.map(segment => segment.encodeDescription)
    }
    if (avType !== VIDEO) {
      const { audibleSegmentDescriptions: audible } = this
      commands.audibleDescriptions = audible.map(segment => segment.encodeDescription)
    }
    return commands
  }

  private _precodeSegmentDescriptions?: ServerSegmentDescription[]

  get precodeSegmentDescriptions(): ServerSegmentDescription[] {
    const { _precodeSegmentDescriptions } = this
    if (_precodeSegmentDescriptions) return _precodeSegmentDescriptions

    // find the clips that need precoding
    const { mash, timeRange } = this
    const clips = mash.clipsInTimeOfType(timeRange, VIDEO)
    const prerenderClips = clips.filter(clip => clip.requiresPrecoding)
    return this._precodeSegmentDescriptions = prerenderClips.map(clip => {
      const args = this.segmentArgs(clip.timeRange)
      args.clip = clip
      return new VideoServerSegmentDescriptionClass(args)
    })
  }
  get precodeMashCommands(): PrecodeCommands | undefined {
    const { avType, precodeSegmentDescriptions: segments } = this
    if (avType === AUDIO || !segments.length) return

    const commands: PrecodeCommands = { 
      outputOptions: this.outputOptions(VIDEO), 
      commandDescriptions: segments.map(segment => segment.precodeDescription),
      times: this.timesVideo
    }
    return commands
  }
  
  private probingsPromise(): Promise<DataOrError<number>> {
    const { intrinsicsUnknownClips, args } = this
    const { quantize } = args.mash
    assertAboveZero(quantize, 'assureClipFrames quantize')

    const promises: Promise<DataOrError<number>>[] = intrinsicsUnknownClips.flatMap(clip => {
      const { content } = clip
      const { asset } = content
      if (!isRequestable(asset)) return []

      const { type, request } = asset
      const event = new EventServerDecode(PROBE, type, request, '', JSON, { types: PROBING_TYPES })
      MOVIEMASHER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (!promise) return errorPromise(ERROR.Unimplemented, EventServerDecode.Type)

      const framesPromise: Promise<DataOrError<number>> = promise.then(orError => {
        if (isDefiniteError(orError)) return orError

        const { data: json } = orError
        const probingData = jsonParse<Decoding>(json)
        assertTyped(probingData, 'probingData')
        // console.log(this.constructor.name, 'assureClipFrames PROBE', probingData)
        asset.decodings.push(probingData)
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

  private get mute(): boolean { return !!this.args.mute }

  get needsPrecoding(): boolean { return !!this.precodeSegmentDescriptions.length }

  private outputOptions(type?: AVType) { 
    const { outputOptions: base = {} } = this.args
    const avType = type || this.avType
    const orBase = avType === VIDEO ? base : typeOutputOptions(AUDIO, base)
    return avType === AUDIO ? orBase : typeOutputOptions(VIDEO, orBase)
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
    const clips = mash.clipsInTimeOfType(timeRange, AUDIO)
    // console.log(this.constructor.name, 'timesAudio clips', clips.length)

    const unmutedClips = clips.filter(clip => clip.canBeMuted && !clip.muted)
    // console.log(this.constructor.name, 'timesAudio unmuted', unmutedClips.length)
    if (unmutedClips.length) times.push(timeRange)
    return times
  }

  private get timesVideo(): Times {
    const { quantize, mash, timeRange } = this
    const clips = mash.clipsInTimeOfType(timeRange, VIDEO)
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
    return uniqueFrames.map(uniqueFrame => {
      const range = timeRangeFromArgs(frame, quantize, uniqueFrame - frame)
      frame = uniqueFrame
      return range
    })
  }

  get videoRate(): number { return Number(this.outputOptions(VIDEO).videoRate) }
  
  private _visibleSegmentDescriptions?: ServerSegmentDescription[]
  get visibleSegmentDescriptions(): ServerSegmentDescription[]  {
    const { _visibleSegmentDescriptions } = this
    if (_visibleSegmentDescriptions) return _visibleSegmentDescriptions

    const descriptions: ServerSegmentDescription[] = []
    const { assetType } = this

    switch (assetType) {
      case IMAGE: {
        const args = this.segmentArgs(this.time)
        descriptions.push(new ImageServerSegmentDescriptionClass(args))
        break
      }
      case VIDEO: {
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
