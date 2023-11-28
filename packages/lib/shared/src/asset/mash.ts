import type { Asset, AssetCacheArgs, Assets, Clip, ClipObject, Clips, Constrained, DataOrError, InstanceArgs, InstanceCacheArgs, InstanceObject, MashAsset, MashAssetObject, Size, Strings, Time, Track, TrackArgs, UnknownRecord } from '@moviemasher/runtime-shared'

import { AUDIO, BOTH, DURATION_NONE, DURATION_UNKNOWN, ERROR, MASH, NUMBER, RGB, RGB_BLACK, SIZE_OUTPUT, STRING, VIDEO, errorThrow, isArray, sortByIndex } from '@moviemasher/runtime-shared'
import { arrayUnique } from '@moviemasher/runtime-shared'
import { assertTrue, isPositive } from '../utility/guards.js'
import { sizeAspect } from '../utility/rect.js'
import { promiseNumbers } from '../utility/request.js'
import { assertTime, timeFromArgs } from '../utility/time.js'

const DefaultQuantize = 10

export function MashAssetMixin
<T extends Constrained<Asset>>(Base: T): 
T & Constrained<MashAsset> {
  return class extends Base implements MashAsset {
    declare aspectWidth: number
    declare aspectHeight: number
    declare aspectShortest: number

    override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
      const preloadOptions = this.cacheOptions(args)
      const { time = timeFromArgs(), audible, visible } = args
      const { quantize } = this
      assertTime(time)

      const scaled = time.scale(this.quantize)
      const type = (audible && visible) ? BOTH : (audible ? AUDIO : VIDEO)
      const clips = this.clipsInTimeOfType(scaled, type)

      const promises = clips.map(clip => {
        const clipTime = clip.timeRange
        const preloadArgs: InstanceCacheArgs = { 
          ...preloadOptions, clipTime, quantize, time 
        }
        return clip.clipCachePromise(preloadArgs)
      })
      return promiseNumbers(promises)
    }

    get assetIds(): Strings {
      return arrayUnique(this.clips.flatMap(clip => clip.assetIds))
    }
  
    override get assetObject(): MashAssetObject {
      const { tracks: trackInstances } = this
      const tracks = trackInstances.map(track => track.trackObject)
      const object: MashAssetObject = { ...super.assetObject, tracks }
      return object
    }
    
    override get assets(): Assets { 
      return this.assetIds.map(id => this.asset(id)) 
    }

    private assureTrack(): void {
      if (!this.tracks.length) {
        const trackArgs: TrackArgs = { dense: true, mashAsset: this }
        const track = this.trackInstance(trackArgs)
        track.mash = this
        this.tracks.push(track)
      }
    }
  
    audio = true
  
    private cacheOptions(options: AssetCacheArgs): AssetCacheArgs {
      const { time, audible, visible, ...rest } = options
      const isRange = time?.isRange
      const definedVisible = visible || !isRange
      const definedAudible = isRange && audible

      const args: AssetCacheArgs = {
        ...rest,
        audible: definedAudible, visible: definedVisible,
        time,
        quantize: this.quantize,
      }

      const okay = definedVisible || definedAudible
      // if (!okay) console.log(this.constructor.name, 'graphFileArgs', args)
      assertTrue(okay, 'audible || visible')
      return args
    }
  
    clipInstance(_object: ClipObject): Clip {
      return errorThrow(ERROR.Unimplemented)
    }
  
    private clipIntersects(clip: Clip, range: Time): boolean {
      if (!clip.frames) return true
  
      return clip.timeRange.intersects(range)
    }
  
    get clips(): Clip[] {
      return this.tracks.map(track => track.clips).flat() 
    }
  
    clipsAudibleInTime(time: Time): Clips {
      const { clips } = this
      const clipsAudible = clips.filter(clip => clip.mutable && clip.notMuted)
      return this.filterIntersecting(clipsAudible, time)
    }
  
    private clipsInTime(time: Time): Clip[] {
      return this.filterIntersecting(this.clips, time)
    }
  
    clipsInTimeOfType(time: Time, avType = BOTH): Clip[] {
      switch (avType) {
        case BOTH: return this.clipsInTime(time)
        case AUDIO: return this.clipsAudibleInTime(time)
        case VIDEO: return this.clipsVisibleInTime(time)
      }
      return errorThrow(ERROR.Internal)
    }
  
    private get clipsVisible(): Clip[] {
      return this.clips.filter(clip => clip.container)
    }
  
    private clipsVisibleInTime(time: Time): Clip[] {
      return this.filterIntersecting(this.clipsVisible, time)
    }
  
    declare color: string
    
    get duration(): number { return this.endTime.seconds }
  
    declare encoding: string 

    get endTime(): Time { return timeFromArgs(this.totalFrames, this.quantize) }
  
    private filterIntersecting(clips: Clips, time: Time): Clip[] {
      const scaled = time.scale(this.quantize)
      return clips.filter(clip => this.clipIntersects(clip, scaled)) as Clip[]
    }
  
    // private _gain = 1.0
  
    // get gain(): number { return this._gain }
  
    // set gain(value: number) {
    //   assertPositive(value, 'gain')
  
    //   if (this._gain !== value) {
    //     this._gain = value
    //     if (this._composition) this.composition.setGain(value, this.quantize)
    //   }
    // }
  
    override initializeProperties(object: MashAssetObject): void {
      this.tracks = []
  
      this.properties.push(this.propertyInstance({
        targetId: MASH, name: 'aspectHeight', type: NUMBER, 
        defaultValue: 9, min: 1, step: 1, order: 2
      }))
      this.properties.push(this.propertyInstance({
        targetId: MASH, name: 'aspectWidth', type: NUMBER, 
        defaultValue: 16, min: 1, step: 1, order: 1
      }))
      this.properties.push(this.propertyInstance({
        targetId: MASH, name: 'aspectShortest', type: NUMBER, 
        defaultValue: SIZE_OUTPUT.height, min: 1, step: 1, order: 3
      }))
      this.properties.push(this.propertyInstance({
        targetId: MASH, name: 'color', type: RGB, 
        defaultValue: RGB_BLACK, 
      }))
      this.properties.push(this.propertyInstance({
        targetId: MASH, name: 'quantize', type: NUMBER, 
        defaultValue: DefaultQuantize, step: 1, options: [10, 20, 40]
      }))
      // this.properties.push(this.propertyInstance({
      //   targetId: MASH, name: 'encoding', type: STRING, 
      //   defaultValue: ''
      // }))
      const { tracks } = object

      super.initializeProperties(object)
      
      if (isArray(tracks)) tracks.forEach((trackObject, index) => {
        const trackArgs: TrackArgs = {
          mashAsset: this, dense: !index, ...trackObject, index
        }
        const track = this.trackInstance(trackArgs)
        track.assureFrames(this.quantize)
        track.sortClips()
        this.tracks.push(track)
      })
      this.assureTrack()
      this.tracks.sort(sortByIndex)
    }
  
    instanceArgs(object?: InstanceObject): InstanceArgs {
      return { ...super.instanceArgs(object), asset: this, assetId: this.id }
    }

    loop = false
  
    declare quantize: number
  
    get size(): Size {
      const { aspectHeight, aspectWidth, aspectShortest } = this 
      const size = sizeAspect(aspectWidth, aspectHeight, aspectShortest)
      // console.log(this.constructor.name, 'size', aspectWidth, aspectHeight, aspectShortest, size)
      return size
    }
    
    source = MASH
  
    toJSON(): UnknownRecord {
      const { tracks, quantize } = this
      return { ...super.toJSON(), tracks, quantize }
    }
  
    get totalFrames(): number {
      const { tracks } = this
      if (tracks.length) {
        const frames = this.tracks.map(track => track.frames)
        if (isPositive(Math.min(...frames))) return Math.max(0, ...frames)
        
        return DURATION_UNKNOWN
      } 
      return DURATION_NONE
    }
  
    trackInstance(trackArgs: TrackArgs): Track {
      return errorThrow(ERROR.Unimplemented)
    }
  
    declare tracks: Track[] 
  }
}
