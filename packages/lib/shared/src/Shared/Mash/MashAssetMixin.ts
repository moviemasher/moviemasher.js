import type { Asset, Clip, ClipObject, Clips, Constrained, InstanceArgs, InstanceObject, MashAsset, MashAssetObject, Size, Strings, Time, Track, TrackArgs, UnknownRecord } from '@moviemasher/runtime-shared'

import { EventManagedAsset, MovieMasher, TypeMash } from '@moviemasher/runtime-client'
import { ErrorName, SIZE_OUTPUT, SourceMash, assertAsset, errorThrow, isArray } from '@moviemasher/runtime-shared'
import { colorBlack } from '../../Helpers/Color/ColorConstants.js'
import { timeFromArgs } from '../../Helpers/Time/TimeUtilities.js'
import { AVTypeAudio, AVTypeBoth, AVTypeVideo } from "../../Setup/AVTypeConstants.js"
import { DataTypeNumber, DataTypeRgb } from "../../Setup/DataTypeConstants.js"
import { Default } from '../../Setup/Default.js'
import { DurationNone, DurationUnknown } from '../../Setup/DurationConstants.js'
import { propertyInstance } from "../../Setup/PropertyFunctions.js"
import { sizeAspect } from "../../Utility/SizeFunctions.js"
import { sortByIndex } from '../../Utility/SortFunctions.js'
import { isPositive } from '../SharedGuards.js'
import { arrayUnique } from '../../Utility/ArrayFunctions.js'

export function MashAssetMixin
<T extends Constrained<Asset>>(Base: T): 
T & Constrained<MashAsset> {
  return class extends Base implements MashAsset {
    declare aspectWidth: number
    declare aspectHeight: number
    declare aspectShortest: number
  
    get assetIds(): Strings {
      return arrayUnique(this.clips.flatMap(clip => clip.assetIds))
    }
  
    override get assetObject(): MashAssetObject {
      const { tracks: trackInstances, assetIds } = this
      const media = assetIds.map(id => {
        const event = new EventManagedAsset(id)
        MovieMasher.eventDispatcher.dispatch(event)
        const { asset } = event.detail
        assertAsset(asset)

        return asset.assetObject
      })
      const tracks = trackInstances.map(track => track.trackObject)
      const object: MashAssetObject = { ...super.assetObject, tracks, media }

      return object
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
  
    clipInstance(_object: ClipObject): Clip {
      return errorThrow(ErrorName.Unimplemented)
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
  
    clipsInTimeOfType(time: Time, avType = AVTypeBoth): Clip[] {
      switch (avType) {
        case AVTypeBoth: return this.clipsInTime(time)
        case AVTypeAudio: return this.clipsAudibleInTime(time)
        case AVTypeVideo: return this.clipsVisibleInTime(time)
      }
      return errorThrow(ErrorName.Internal)
    }
  
    private get clipsVisible(): Clip[] {
      return this.clips.filter(clip => clip.container)
    }
  
    private clipsVisibleInTime(time: Time): Clip[] {
      return this.filterIntersecting(this.clipsVisible, time)
    }
  
    
    declare color: string
    
    get duration(): number { return this.endTime.seconds }
  
  
    get endTime(): Time { return timeFromArgs(this.totalFrames, this.quantize) }
  
    private filterIntersecting(clips: Clips, time: Time): Clip[] {
      const scaled = time.scale(this.quantize)
      return clips.filter(clip => this.clipIntersects(clip, scaled)) as Clip[]
    }
  
    // private _gain = Default.mash.gain
  
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
  
      this.properties.push(propertyInstance({
        targetId: TypeMash, name: 'aspectHeight', type: DataTypeNumber, 
        defaultValue: 9, min: 1, step: 1, order: 2
      }))
      this.properties.push(propertyInstance({
        targetId: TypeMash, name: 'aspectWidth', type: DataTypeNumber, 
        defaultValue: 16, min: 1, step: 1, order: 1
      }))
      this.properties.push(propertyInstance({
        targetId: TypeMash, name: 'aspectShortest', type: DataTypeNumber, 
        defaultValue: SIZE_OUTPUT.height, min: 1, step: 1, order: 3
      }))
      this.properties.push(propertyInstance({
        targetId: TypeMash, name: 'color', type: DataTypeRgb, 
        defaultValue: colorBlack, 
      }))
      this.properties.push(propertyInstance({
        targetId: TypeMash, name: 'quantize', type: DataTypeNumber, 
        defaultValue: Default.mash.buffer, step: 1, options: [10, 20, 40]
      }))
      const { media, tracks } = object
      if (isArray(media)) {
        media.forEach(assetObject => {
          MovieMasher.eventDispatcher.dispatch(new EventManagedAsset(assetObject))
        })
      }
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
      super.initializeProperties(object)
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
    
    source = SourceMash
  
    toJSON(): UnknownRecord {
      const { tracks, quantize } = this
      return { ...super.toJSON(), tracks, quantize }
    }
  
    get totalFrames(): number {
      const { tracks } = this
      if (tracks.length) {
        const frames = this.tracks.map(track => track.frames)
        if (isPositive(Math.min(...frames))) return Math.max(0, ...frames)
        
        return DurationUnknown
      } 
      return DurationNone
    }
  
    trackInstance(trackArgs: TrackArgs): Track {
      return errorThrow(ErrorName.Unimplemented)
    }
  
    declare tracks: Track[] 
  }
}