import type { AVType, AssetCacheArgs, DataOrError, Decoding, EncodingType, IntrinsicOptions, Size, Time, VideoOutputOptions } from '@moviemasher/runtime-shared'
import type { ServerClips, ServerMashAsset } from '../Types/ServerMashTypes.js'
import type { FilterGraphs, FilterGraphsArgs, FilterGraphsOptions } from './FilterGraphs/FilterGraphs.js'
import type { CommandDescription, MashDescriber, MashDescriberOptions, MashDescription } from './MashDescriberTypes.js'

import { assertAboveZero, isAboveZero, isPositive, isRequestable } from '@moviemasher/lib-shared/utility/guards.js'
import { sizeAboveZero, sizeCopy } from '@moviemasher/lib-shared/utility/rect.js'
import { promiseNumbers } from '@moviemasher/lib-shared/utility/request.js'
import { timeFromArgs, timeRangeFromArgs, timeRangeFromTimes } from '@moviemasher/lib-shared/utility/time.js'
import { EventServerDecode, MOVIEMASHER_SERVER } from '@moviemasher/runtime-server'
import { ASSET_DURATION, AUDIO, BOTH, ERROR, IMAGE, JSON, PROBE, PROBING_TYPES, VIDEO, assertTyped, errorPromise, errorThrow, isDefiniteError, jsonParse } from '@moviemasher/runtime-shared'
import { FilterGraphsClass } from './FilterGraphs/FilterGraphsClass.js'

const filterGraphsArgs = (mash: ServerMashAsset, options: FilterGraphsOptions = {}): FilterGraphsArgs => {
  const { background, time, avType, size, videoRate, ...rest } = options
  const definedTime = time || timeFromArgs()
  const definedAVType = avType || (definedTime.isRange ? BOTH : VIDEO)
  const filterGraphsOptions: FilterGraphsArgs = {
    ...rest,
    times: mash.timeRanges(definedAVType, definedTime),
    avType: definedAVType,
    size: size || mash.size,
    videoRate: videoRate || definedTime.fps,
    mash,
    background: background || mash.color,
  }
  return filterGraphsOptions
}

const filterGraphsInstance = (args: FilterGraphsArgs): FilterGraphs => {
  return new FilterGraphsClass(args)
}

export class MashDescriberClass implements MashDescriber {
  constructor(public args: MashDescriberOptions) {}

  private get assetCacheArgs(): AssetCacheArgs {
    const { quantize } = this.args.mash
    const { avType } = this
    const args: AssetCacheArgs = { quantize }
    if (avType !== AUDIO) args.visible = true
    if (avType !== VIDEO) args.audible = true
    return args
  }
  protected assureClipFrames(): Promise<DataOrError<number>> {
    const { intrinsicsUnknownClips, args } = this
    const { quantize } = args.mash
    assertAboveZero(quantize, 'assureClipFrames quantize')

    const promises: Promise<DataOrError<number>>[] = intrinsicsUnknownClips.flatMap(clip => {
      const { content } = clip
      const { asset } = content
      if (!isRequestable(asset)) return []

      const { type, request } = asset
      const event = new EventServerDecode(PROBE, type, request, '', JSON, { types: PROBING_TYPES })
      MOVIEMASHER_SERVER.eventDispatcher.dispatch(event)
      
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
      // console.log(this.constructor.name, 'assureClipFrames', framesUnknownClips.length)
      
      framesUnknownClips.forEach(clip => {
        clip.resetTiming(undefined, quantize)

        // console.log(this.constructor.name, 'assureClipFrames CALLED resetTiming', clip.frames, { quantize})

        if (isAboveZero(clip.frames)) return
  
        clip.frames = Math.floor(ASSET_DURATION * quantize)
        // console.log(this.constructor.name, 'assureClipFrames SET frames', clip.frames)

      })
      return orError
    })
  }

  private get avType() { 
    switch (this.encodingType) {
      case AUDIO: return AUDIO
      case IMAGE: return VIDEO
      case VIDEO: return BOTH 
    }
  }

  private get avTypeNeededForClips(): AVType {
    const { avType } = this
    if (avType !== BOTH) return avType

    const renderingClips = this.args.mash.clipsInTimeOfType(this.timeRange, this.avType)
    const types = new Set<AVType>()
    renderingClips.forEach(renderingClip => {
      if (renderingClip.audible) types.add(AUDIO)
      if (renderingClip.visible) types.add(VIDEO)
    })
    // console.log(this.constructor.name, 'avTypeNeededForClips', types)
    if (types.size === 2) return avType
    const [type] = types
    return type
  }

  private get encodingType(): EncodingType { return this.args.encodingType }

  private get endTime(): Time | undefined {
    if (this.encodingType === IMAGE) return 

    const { args } = this
    const { endTime, mash } = args
    // console.log(this.constructor.name, 'endTime', mash.tracks)
    return endTime || mash.endTime
  }

  private filterGraphs(preloading: boolean): FilterGraphs {
    const { mash } = this.args
    const args = filterGraphsArgs(mash, this.filterGraphsOptions(preloading))
    return filterGraphsInstance(args)
  }

  private filterGraphsOptions(preloading: boolean): FilterGraphsOptions {
    const { timeRange, videoRate, outputSize: size } = this
    const filterGraphsOptions: FilterGraphsOptions = {
      time: timeRange, videoRate, size, 
      avType: preloading ? this.avType : this.avTypeNeededForClips
    }
    // console.log(this.constructor.name, 'filterGraphsOptions', filterGraphsOptions)
    return filterGraphsOptions
  }

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

  private get options() { return this.args.outputOptions }

  private get outputSize(): Size {
    const { options: outputOptions } = this
    if (sizeAboveZero(outputOptions)) return sizeCopy(outputOptions)

    if (this.avType === AUDIO) return { width: 0, height: 0 }

    return errorThrow(ERROR.OutputDimensions)
  }

  async mashDescriptionPromise(): Promise<DataOrError<MashDescription>> {
    const intrinsicsOrError = await this.intrinsicsPromise
    if (isDefiniteError(intrinsicsOrError)) return intrinsicsOrError

    const framesOrError = await this.assureClipFrames()
    if (isDefiniteError(framesOrError)) return framesOrError

    const { avTypeNeededForClips: avType, args } = this
    const { mash } = args
    const cacheArgs: AssetCacheArgs = { 
      time: this.timeRange,
      audible: avType !== VIDEO, visible: avType !== AUDIO 
    }
    const cacheOrError = await mash.assetCachePromise(cacheArgs)
    if (isDefiniteError(cacheOrError)) return cacheOrError

    const filesOrError = await this.filterGraphs(true).loadCommandFilesPromise
    if (isDefiniteError(filesOrError)) return filesOrError
    
    const { options: outputOptions, encodingType } = this
    const renderingDescription: MashDescription = { 
      outputOptions, encodingType
    }
    const filterGraphs  = this.filterGraphs(false)
    // console.log(this.constructor.name, 'renderingDescriptionPromise avType', avType)
    if (avType !== AUDIO) {
      const { filterGraphsVisible } = filterGraphs
      const visibleCommandDescriptions = filterGraphsVisible.map(filterGraph => {
        const { commandInputs: inputs, commandFilters, duration } = filterGraph
        const commandDescription: CommandDescription = { inputs, commandFilters, duration, avType: VIDEO }
      // console.log(this.constructor.name, 'renderingDescriptionPromise inputs, commandFilters', inputs, commandFilters)
        return commandDescription
      })
      renderingDescription.visibleCommandDescriptions = visibleCommandDescriptions
    }
    if (avType !== VIDEO) {
      const { filterGraphAudible, duration } = filterGraphs
      if (filterGraphAudible) {
        const { commandFilters, commandInputs: inputs } = filterGraphAudible
      // console.log(this.constructor.name, 'renderingDescriptionPromise filterGraphAudible', commandFilters)
      
        const commandDescription: CommandDescription = {
          inputs, commandFilters, duration, avType: AUDIO
        }
        renderingDescription.audibleCommandDescription = commandDescription
      }
    }
    return { data: renderingDescription }
  }

  private get startTime(): Time {
    const { mash, startTime } = this.args
    const { quantize, totalFrames: frames } = mash
    if (this.encodingType === IMAGE) {
      if (frames < 0) return timeFromArgs(0, quantize)

      return timeRangeFromArgs(0, quantize, frames).positionTime(0, 'ceil')
    }
    if (startTime) return startTime
  
    return timeFromArgs(0, quantize)
  }


  private get timeRange(): Time { 
    const { startTime } = this
    if (this.encodingType === IMAGE) return startTime

    const { endTime } = this
    // console.log(this.constructor.name, 'timeRange', startTime, endTime)
    return timeRangeFromTimes(startTime, endTime) 
  }

  private get videoRate(): number { 
    const { options: outputOptions } = this
    const { videoRate } = outputOptions as VideoOutputOptions

    return isAboveZero(videoRate) ? videoRate : 0
}

  // private get clipsLackingSize(): ServerClips {
  //   const { timeRange, args } = this
  //   const { mash } = args
  //   const clips = mash.clipsInTimeOfType(timeRange, VIDEO)
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
