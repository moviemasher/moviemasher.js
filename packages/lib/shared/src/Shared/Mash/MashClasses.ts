import type { InstanceArgs, InstanceObject } from '@moviemasher/runtime-shared'
import type { MashAssetObject, MashAsset, MashInstance } from '@moviemasher/runtime-shared'

import { AssetClass } from '../Asset/AssetClass.js'
import { InstanceClass } from '../Instance/InstanceClass.js'
import { SourceMash, Strings, UnknownRecord } from '@moviemasher/runtime-shared'
import type { Time } from '@moviemasher/runtime-shared'
import type { Clip, Clips } from '@moviemasher/runtime-shared'
import type { Track, TrackArgs } from '@moviemasher/runtime-shared'
import type { Encodings } from '@moviemasher/runtime-shared'
import type { Size } from '@moviemasher/runtime-shared'

import {
  DurationNone, DurationUnknown} from "../../Setup/EnumConstantsAndFunctions.js"
import { AVTypeAudio, AVTypeBoth, AVTypeVideo } from "../../Setup/AVTypeConstants.js"
import { DataTypeRgb } from "../../Setup/DataTypeConstants.js"
import {
  timeFromArgs} from '../../Helpers/Time/TimeUtilities.js'
import { Default } from '../../Setup/Default.js'
import { 
  isAboveZero, 
  isPositive 
} from '../SharedGuards.js'
import { isArray } from "@moviemasher/runtime-shared"
import { sortByIndex } from '../../Utility/SortFunctions.js'
import { isSize } from "../../Utility/SizeFunctions.js"
import { SizeZero } from "../../Utility/SizeConstants.js"
import { propertyInstance } from "../../Setup/PropertyFunctions.js"
import { colorBlack } from '../../Helpers/Color/ColorConstants.js'
import { errorThrow } from '@moviemasher/runtime-shared'
import { ErrorName } from '@moviemasher/runtime-shared'
import { AssetManager } from '@moviemasher/runtime-shared'

import { encodingInstance } from '../../Plugin/Encode/Encoding/EncodingFactory.js'
import { ClipObject } from '@moviemasher/runtime-shared'


export class MashAssetClass extends AssetClass implements MashAsset {
  get assetIds(): Strings {
    const { clips } = this
    const ids = clips.flatMap(clip => clip.assetIds)
    const set = [...new Set(ids)]

    // console.log(this.constructor.name, 'assetIds', set.length)
    return set
  }

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

  
  declare color: string
  
 

  get duration(): number { return this.endTime.seconds }

  declare encodings: Encodings 

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
  declare imageSize: Size 
  
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


  instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }

  // declare loading: boolean
  
  loop = false

  declare media: AssetManager
  

  quantize = Default.mash.quantize


  _rendering = ''



  source = SourceMash

  toJSON(): UnknownRecord {
    const { encodings, tracks, quantize } = this
    return { 
      ...super.toJSON(), 
      encodings, tracks, quantize
    }
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


export class MashInstanceClass extends InstanceClass implements MashInstance {
  declare asset: MashAsset
}