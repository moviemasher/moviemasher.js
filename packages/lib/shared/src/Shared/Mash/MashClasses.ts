import type { InstanceArgs, InstanceObject } from '../Instance/Instance.js'
import type { MashAssetObject, MashAsset, MashInstance } from './MashTypes.js'

import { AssetClass } from '../Asset/AssetClass.js'
import { InstanceClass } from '../Instance/InstanceClass.js'
import { SourceMash, Strings, UnknownRecord } from '@moviemasher/runtime-shared'
import type { Time } from '@moviemasher/runtime-shared'
import type { Clip, Clips } from './Clip/Clip.js'
import type { Track, TrackArgs } from './Track/Track.js'
import type { Encodings } from '../../Plugin/Encode/Encoding/Encoding.js'
import type { Size } from '@moviemasher/runtime-shared'

import {
  DurationNone, DurationUnknown} from "../../Setup/EnumConstantsAndFunctions.js"
import { AVTypeAudio, AVTypeBoth, AVTypeVideo } from "../../Setup/AVTypeConstants.js"
import { DataTypeRgb } from "../../Setup/DataTypeConstants.js"
import {
  timeFromArgs} from '../../Helpers/Time/TimeUtilities.js'
import { Default } from '../../Setup/Default.js'
import { 
  isAboveZero, isArray, 
  isPositive 
} from '../SharedGuards.js'
import { sortByIndex } from '../../Utility/SortFunctions.js'
import { isSize } from "../../Utility/SizeFunctions.js"
import { SizeZero } from "../../Utility/SizeConstants.js"
import { propertyInstance } from "../../Setup/PropertyFunctions.js"
import { colorBlack } from '../../Helpers/Color/ColorConstants.js'
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { ErrorName } from '../../Helpers/Error/ErrorName.js'
import { AssetManager } from '../Asset/AssetManager/AssetManagerTypes.js'

import { encodingInstance } from '../../Plugin/Encode/Encoding/EncodingFactory.js'
import { ClipObject } from './Clip/ClipObject.js'


export class MashAssetClass extends AssetClass implements MashAsset {

  instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }

  declare color: string
  
  declare imageSize: Size 
  
  private assureTrack(): void {
    if (!this.tracks.length) {
      const trackArgs: TrackArgs = { dense: true, mashAsset: this }
      const track = this.trackInstance(trackArgs)
      track.mash = this
      this.tracks.push(track)
    }
  }

  clipInstance(object: ClipObject): Clip {
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

  
  get assetIds(): Strings {
    const { clips } = this
    const ids = clips.flatMap(clip => clip.assetIds)
    const set = [...new Set(ids)]

    // console.log(this.constructor.name, 'assetIds', set.length)
    return set
  }


  get duration(): number { return this.endTime.seconds }


  get endTime(): Time { return timeFromArgs(this.totalFrames, this.quantize) }


  private filterIntersecting(clips: Clips, time: Time): Clip[] {
    const scaled = time.scale(this.quantize)
    return clips.filter(clip => this.clipIntersects(clip, scaled)) as Clip[]
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

  // private _gain = Default.mash.gain

  // get gain(): number { return this._gain }

  // set gain(value: number) {
  //   assertPositive(value, 'gain')

  //   if (this._gain !== value) {
  //     this._gain = value
  //     if (this._composition) this.composition.setGain(value, this.quantize)
  //   }
  // }

  initializeProperties(object: MashAssetObject): void {
    this.tracks = []
    this.encodings = []

    const { encodings, size } = object 
  
    this.imageSize = isSize(size) ? size : { ...SizeZero }
    
    if (isArray(encodings)) this.encodings.push(...encodings.map(encodingInstance))
    
    this.properties.push(propertyInstance({
      name: 'color', defaultValue: colorBlack, type: DataTypeRgb
    }))

    // this.label ||= Default.mash.label
    const { media, tracks, quantize, color } = object

    if (isArray(media)) this.media.define(media)
    if (isAboveZero(quantize)) this.quantize = quantize
    if (color) this.setValue(color, 'color')

    if (isArray(tracks)) tracks.forEach((trackObject, index) => {
      const trackArgs: TrackArgs = {
        mashAsset: this,
        dense: !index, ...trackObject, index
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


  // declare loading: boolean
  
  loop = false

  declare media: AssetManager
  

  quantize = Default.mash.quantize


  _rendering = ''

  declare encodings: Encodings 



  toJSON(): UnknownRecord {
    const { encodings, tracks, quantize } = this
    return { 
      ...super.toJSON(), 
      encodings, tracks, quantize
    }
  }

  source = SourceMash

  declare tracks: Track[] 

  trackInstance(trackArgs: TrackArgs): Track {
    return errorThrow(ErrorName.Unimplemented)
  }

}


export class MashInstanceClass extends InstanceClass implements MashInstance {
  declare asset: MashAsset
}