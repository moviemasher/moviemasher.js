import type { ServerMediaRequest } from '@moviemasher/runtime-server'
import type { AVType, AssetCacheArgs, DataOrError, DecodingObject, EncodingType, IntrinsicOptions, Size, Time, VideoOutputOptions } from '@moviemasher/runtime-shared'
import type { ServerClips } from '../Types/ServerMashTypes.js'
import type { CommandDescription, RenderingDescription, RenderingOutput, RenderingOutputArgs } from './Encode.js'
import type { FilterGraphsOptions } from './FilterGraphs/FilterGraphs.js'

import { AVTypeAudio, AVTypeBoth, AVTypeVideo, JsonExtension, assertAboveZero, isAboveZero, isRequestable, promiseNumbers, sizeAboveZero, sizeCopy, timeFromArgs, timeRangeFromArgs, timeRangeFromTimes } from '@moviemasher/lib-shared'
import { EventServerDecode, MovieMasher } from '@moviemasher/runtime-server'
import { ERROR, AUDIO, IMAGE, PROBE, VIDEO, errorThrow, isDefiniteError, errorPromise } from '@moviemasher/runtime-shared'
import { idUnique } from '../Utility/Hash.js'
import { KindsProbe } from '../decode/ProbeConstants.js'
import { isServerAudibleAsset, isServerVisibleAsset } from '../guard/assets.js'
import { filterGraphsArgs, filterGraphsInstance } from './FilterGraphs/FilterGraphsFactory.js'

export class RenderingOutputClass implements RenderingOutput {
  constructor(public args: RenderingOutputArgs) {}

  protected assureClipFrames(): Promise<DataOrError<number>> {
    const { durationClips, args } = this
    const { quantize } = args.mash
    const promises: Promise<DataOrError<number>>[] = durationClips.flatMap(clip => {
      const { content } = clip
      const { asset } = content
      if (!isRequestable(asset)) return []
      
      const request = asset.request as ServerMediaRequest
      const { path: inputPath } = request
      if (!inputPath) return []

      const decodingId = idUnique()
      const event = new EventServerDecode(PROBE, inputPath, JsonExtension, { types: KindsProbe }, decodingId)
      MovieMasher.eventDispatcher.dispatch(event)
      
      const { promise } = event.detail
      if (!promise) return errorPromise(ERROR.Unimplemented, EventServerDecode.Type)

      const framesPromise: Promise<DataOrError<number>> = promise.then(orError => {
        if (isDefiniteError(orError)) return orError

        const { data: json } = orError
        const probingData: DecodingObject = JSON.parse(json)
        asset.decodings.push(probingData)
        if (!clip.intrinsicsKnown({ duration: true }) && isServerAudibleAsset(asset)) {
          const frames = asset.frames(quantize)
          assertAboveZero(frames)        
          if (frames) clip.frames = frames

        }
        if (!clip.intrinsicsKnown({ size: true }) && isServerVisibleAsset(asset)) {

          console.error(this.constructor.name, 'assureClipFrames size intrinsics unknown', asset.id)
        }
        // console.log(this.constructor.name, 'assureClipFrames', asset.id, frames)
        return { data: 1 }
        
      })
      return [framesPromise]
    })
    return promiseNumbers(promises) 
  }

  private get avType() { 
    switch (this.encodingType) {
      case AUDIO: return AVTypeAudio
      case IMAGE: return AVTypeVideo
      case VIDEO: return AVTypeBoth 
    }
  }

  private get avTypeNeededForClips(): AVType {
    const { avType } = this
    if (avType !== AVTypeBoth) return avType

    const renderingClips = this.args.mash.clipsInTimeOfType(this.timeRange, this.avType)
    const types = new Set<AVType>()
    renderingClips.forEach(renderingClip => {
      if (renderingClip.audible) types.add(AVTypeAudio)
      if (renderingClip.visible) types.add(AVTypeVideo)
    })
    // console.log(this.constructor.name, 'avTypeNeededForClips', types)
    if (types.size === 2) return avType
    const [type] = types
    return type
  }


  // private get duration(): number { 
  //   if (this.encodingType === IMAGE) return 0
    
  //   return this.timeRange.lengthSeconds 
  // }

  private _durationClips?: ServerClips
  private get durationClips(): ServerClips { return this._durationClips ||= this.durationClipsInitialize }
  private get durationClipsInitialize(): ServerClips {
    const { mash } = this.args
    // const { totalFrames: frames } = mash
    // console.log(this.constructor.name, 'durationClipsInitialize', frames)
    // if (isPositive(frames)) return []
    
    const { clips } = mash
    const options: IntrinsicOptions = { duration: true, size: true }
    const zeroClips = clips.filter(clip => !clip.intrinsicsKnown(options))
    // console.log(this.constructor.name, 'durationClipsInitialize', zeroClips.length)

    return zeroClips
  }

  private get endTime(): Time | undefined {
    if (this.encodingType === IMAGE) return 

    const { args } = this
    const { endTime, mash } = args
    // console.log(this.constructor.name, 'endTime', mash.tracks)
    return endTime || mash.endTime
  }

  // private get durationGraphFiles(): GraphFiles {
  //   const clips = this.durationClips
  //   const options: IntrinsicOptions = { duration: true }
  //   const files = clips.flatMap(clip => clip.intrinsicGraphFiles(options))
  //   const unique = new Set(files)
  //   return [...unique]
  // }

  // private _filterGraphs?: FilterGraphsthis._filterGraphs =
  private get filterGraphs() {
    const { mash } = this.args
    const args = filterGraphsArgs(mash, this.filterGraphsOptions)
    return filterGraphsInstance(args)
  }

  private get filterGraphsOptions(): FilterGraphsOptions {
    const { timeRange, videoRate, outputSize: size } = this
    const filterGraphsOptions: FilterGraphsOptions = {
      time: timeRange, videoRate, size, 
      avType: this.avTypeNeededForClips
    }
    return filterGraphsOptions
  }

  private get mashDurationPromise(): Promise<DataOrError<number>> {
    const { durationClips: clips } = this
    if (!clips.length) return Promise.resolve({ data: 0 })

    const { quantize } = this.args.mash
    const options: AssetCacheArgs = { quantize, audible: true, visible: true }

    const promises = clips.flatMap(clip => {
      const { content, container } = clip
      const promises = [content.asset.assetCachePromise(options)]
      if (container) {
        promises.push(container.asset.assetCachePromise(options))
      }
      return promises
    })

    return promiseNumbers(promises)
  }

  private get outputOptions() { return this.args.outputOptions }

  private get outputSize(): Size {
    const { outputOptions } = this
    if (sizeAboveZero(outputOptions)) return sizeCopy(outputOptions)

    if (this.avType === AVTypeAudio) return { width: 0, height: 0 }

    return errorThrow(ERROR.OutputDimensions)
  }

  private get encodingType(): EncodingType { return this.args.encodingType }

  renderingDescriptionPromise(): Promise<DataOrError<RenderingDescription>> {
    return this.mashDurationPromise.then(orError => {
      if (isDefiniteError(orError)) return orError

      // return errorPromise(ERROR.Ffmpeg, 'mashDurationPromise')
  
      // console.log(this.constructor.name, 'mashDurationPromise done')
      return this.assureClipFrames().then(orError => {
        if (isDefiniteError(orError)) return orError

        // return errorPromise(ERROR.Ffmpeg, 'assureClipFrames')
        return this.filterGraphs.loadCommandFilesPromise.then(orError => {
          if (isDefiniteError(orError)) return orError

          const { outputOptions, encodingType } = this
          const renderingDescription: RenderingDescription = { 
            outputOptions, encodingType
          }
          const avType = this.avTypeNeededForClips
          const { filterGraphs } = this
          // console.log(this.constructor.name, 'renderingDescriptionPromise avType', avType)
          if (avType !== AVTypeAudio) {
            const { filterGraphsVisible } = filterGraphs
            const visibleCommandDescriptions = filterGraphsVisible.map(filterGraph => {
              const { commandInputs: inputs, commandFilters, duration } = filterGraph
              const commandDescription: CommandDescription = { inputs, commandFilters, duration, avType: AVTypeVideo }
            // console.log(this.constructor.name, 'renderingDescriptionPromise inputs, commandFilters', inputs, commandFilters)
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
          return { data: renderingDescription }
        })
      })
    })
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
