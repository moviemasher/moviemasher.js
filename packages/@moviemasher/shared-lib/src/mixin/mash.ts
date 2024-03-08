import type { AVType, Asset, AssetCacheArgs, AssetManager, Clip, ClipObject, Clips, Constrained, DataOrError, Instance, InstanceArgs, InstanceCacheArgs, InstanceObject, MashAsset, MashAssetObject, MashDescription, MashDescriptionOptions, MashIndex, MashInstance, Scalar, ScalarTuple, Size, Strings, Time, Track, TrackArgs, Tracks, UnknownRecord } from '../types.js'

import { $AUDIO, $BOTH, DURATION_NONE, DURATION_UNKNOWN, ERROR, $HEIGHT, $MASH, $NUMBER, $RGB, RGB_BLACK, SIZE_OUTPUT, $VIDEO, $WIDTH, arrayUnique, errorThrow, sortByIndex, SIZE_ZERO, $BOOLEAN } from '../runtime.js'
import { isAboveZero, isArray } from '../utility/guard.js'
import { assertAboveZero, assertTrue } from '../utility/guards.js'
import { isPositive } from '../utility/guard.js'
import { promiseNumbers } from '../runtime.js'
import { assertTime, timeFromArgs } from '../utility/time.js'

const DefaultQuantize = 10

export function MashAssetMixin
<T extends Constrained<Asset>>(Base: T): 
T & Constrained<MashAsset> {
  return class extends Base implements MashAsset {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args as [MashAssetObject]

      const { tracks } = object
    
      this.properties.push(this.propertyInstance({
        targetId: $MASH, name: 'aspectHeight', type: $NUMBER, 
        defaultValue: 9, min: 1, step: 1, order: 2
      }))
      this.properties.push(this.propertyInstance({
        targetId: $MASH, name: 'aspectWidth', type: $NUMBER, 
        defaultValue: 16, min: 1, step: 1, order: 1
      }))
      this.properties.push(this.propertyInstance({
        targetId: $MASH, name: 'aspectShortest', type: $NUMBER, 
        defaultValue: SIZE_OUTPUT.height, min: 1, step: 1, order: 3
      }))
      this.properties.push(this.propertyInstance({
        targetId: $MASH, name: 'color', type: $RGB, 
        defaultValue: RGB_BLACK, 
      }))
      this.properties.push(this.propertyInstance({
        targetId: $MASH, name: 'loop', type: $BOOLEAN, 
        defaultValue: true, 
      }))
      
      this.properties.push(this.propertyInstance({
        targetId: $MASH, name: 'quantize', type: $NUMBER, 
        defaultValue: DefaultQuantize, step: 1, options: [10, 20, 40]
      }))
      
      if (isArray(tracks)) tracks.forEach((trackObject, index) => {
        const trackArgs: TrackArgs = {
          mashAsset: this, dense: !index, ...trackObject, index
        }
        const track = this.trackInstance(trackArgs)
        const { quantize } = this

        assertAboveZero(quantize, 'quantize')

        track.assureFrames(quantize)
        track.sortClips()
        this.tracks.push(track)
      })
      this.assureTrack()
      this.tracks.sort(sortByIndex)
    }

    override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
      const preloadOptions = this.assetCacheArgs(args)
      const { time = timeFromArgs(), audible, visible } = args
      const { quantize } = this
      assertTime(time)

      const scaled = time.scale(this.quantize)
      const type = (audible && visible) ? $BOTH : (audible ? $AUDIO : $VIDEO)
      const clips = this.clipsInTimeOfType(scaled, type)
      // console.log(this.constructor.name, 'assetCachePromise', type, clips.length)
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
      return { ...super.assetObject, tracks }
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
  
    private assetCacheArgs(options: AssetCacheArgs): AssetCacheArgs {
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
      // console.log(this.constructor.name, 'assetCacheArgs', args)
      assertTrue(okay, 'audible || visible')
      return args
    }
  
    clipInstance(_object: ClipObject): Clip {
      return errorThrow(ERROR.Unimplemented)
    }
  
    private clipIntersects(clip: Clip, range: Time): boolean {
      if (!isAboveZero(clip.frames)) return true
  
      return clip.timeRange.intersects(range)
    }
  
    get clips(): Clip[] {
      return this.tracks.map(track => track.clips).flat() 
    }
  
    clipsAudibleInTime(time: Time): Clips {
      const { clips } = this
      const clipsAudible = clips.filter(clip => clip.canBeMuted && !clip.muted)
      return this.filterIntersecting(clipsAudible, time)
    }
  
    private clipsInTime(time: Time): Clip[] {
      return this.filterIntersecting(this.clips, time)
    }
  
    clipsInTimeOfType(time: Time, avType: AVType = $BOTH): Clip[] {
      switch (avType) {
        case $BOTH: return this.clipsInTime(time)
        case $AUDIO: return this.clipsAudibleInTime(time)
        case $VIDEO: return this.clipsVisibleInTime(time)
      }
    }
  
    private clipsVisibleInTime(time: Time): Clip[] {
      const clipsVisible = this.clips.filter(clip => clip.visible)
      return this.filterIntersecting(clipsVisible, time)
    }
 
    get duration(): number { return this.endTime.seconds }
  

    get endTime(): Time { return timeFromArgs(this.totalFrames, this.quantize) }
  
    private filterIntersecting(clips: Clips, time: Time): Clip[] {
      const scaled = time.scale(this.quantize)
      return clips.filter(clip => this.clipIntersects(clip, scaled))
    }  

    instanceArgs(object?: InstanceObject): InstanceArgs {
      return { ...super.instanceArgs(object), asset: this, assetId: this.id }
    }
  
    mashDescription(_: MashDescriptionOptions): MashDescription {
      return errorThrow(ERROR.Unimplemented)
    }

    get mashIndex(): MashIndex { return [0] }

    private get quantize(): number {
      return Number(this.value('quantize'))
    }

    get size(): Size {
      const aspectHeight = this.value('aspectHeight')
      const aspectWidth = this.value('aspectWidth')
      const aspectShortest = this.value('aspectShortest')
      if (isAboveZero(aspectHeight) && isAboveZero(aspectWidth) && isAboveZero(aspectShortest)) {
        return sizeAspect(aspectWidth, aspectHeight, aspectShortest)
      }
      // console.log(this.constructor.name, 'size', aspectWidth, aspectHeight, aspectShortest, size)
      return { ...SIZE_ZERO }
    }
    
    source = $MASH
  
    toJSON(): UnknownRecord {
      console.debug(this.constructor.name, 'toJSON')
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
  
    tracks: Tracks = []
  }
}


export function MashInstanceMixin<T extends Constrained<Instance>>(Base: T):
  T & Constrained<MashInstance> {
  return class extends Base implements MashInstance {
    declare asset: MashAsset
  }
}


const sizeAspect = (aspectWidth: number, aspectHeight: number, shortest: number): Size => {
  const shortestKey = aspectHeight > aspectWidth ? $WIDTH : $HEIGHT
  const longestKey = shortestKey === $WIDTH ? $HEIGHT : $WIDTH
  const max = Math.max(aspectWidth, aspectHeight)
  const min = Math.min(aspectWidth, aspectHeight)
  const ratio = max / min
  const size: Size = { width: 0, height: 0 }
  size[shortestKey] = shortest
  size[longestKey] = shortest * ratio
  return size
}