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
import { trackInstance } from './Track/TrackFactory.js'
import { MashingType } from '../../Plugin/Masher/Masher.js'
import { isSize } from "../../Utility/SizeFunctions.js"
import { SizeZero } from "../../Utility/SizeConstants.js"
import { propertyInstance } from "../../Setup/PropertyFunctions.js"
import { colorBlack } from '../../Helpers/Color/ColorConstants.js'
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { ErrorName } from '../../Helpers/Error/ErrorName.js'
import { AssetCollection } from '../Asset/AssetCollection/AssetCollection.js'
import { AssetCollectionClass } from '../Asset/AssetCollection/AssetCollectionClass.js'

import { Constrained } from '../../Base/Constrained.js'
import { Asset } from '../Asset/Asset.js'
import { Instance } from '../Instance/Instance.js'
import { MashAsset, MashAssetObject, MashInstance } from './MashTypes.js'
import { encodingInstance } from '../../Plugin/Encode/Encoding/EncodingFactory.js'

export function MashAssetMixin
<T extends Constrained<Asset>>(Base: T): 
T & Constrained<MashAsset> {
  return class extends Base implements MashAsset {


  constructor(...args: any[]) {
    const [object] = args
    super(object)

    const { encodings, size } = object as MashAssetObject
   
    if (isSize(size)) this.imageSize = size
    
    if (isArray(encodings)) this.encodings.push(...encodings.map(encodingInstance))
    
    this.properties.push(propertyInstance({
      name: 'color', defaultValue: colorBlack, type: DataTypeRgb
    }))

    // this.label ||= Default.mash.label
  }

  declare color: string
 
  imageSize: Size = { ...SizeZero }
  


  private assureTrack(): void {
    if (!this.tracks.length) {
      const trackArgs: TrackArgs = { dense: true, mashAsset: this }
      const track = trackInstance(trackArgs)
      track.mash = this
      this.tracks.push(track)
    }
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
    const { media, tracks, quantize, color } = object

    if (isArray(media)) this.media.define(media)
    if (isAboveZero(quantize)) this.quantize = quantize
    if (color) this.setValue(color, 'color')

    if (isArray(tracks)) tracks.forEach((trackObject, index) => {
      const trackArgs: TrackArgs = {
        mashAsset: this,
        dense: !index, ...trackObject, index
      }
      const track = trackInstance(trackArgs)
      track.assureFrames(this.quantize)
      track.sortClips()
      this.tracks.push(track)
    })
    this.assureTrack()
    this.tracks.sort(sortByIndex)

    super.initializeProperties(object)
  }
  declare kind: MashingType


  // declare loading: boolean
  
  loop = false

  private _media?: AssetCollection
  get media(): AssetCollection {
    return this._media = new AssetCollectionClass()
  } 

  quantize = Default.mash.quantize


  _rendering = ''
  encodings: Encodings = []



  toJSON(): UnknownRecord {
    const { encodings, tracks, quantize } = this
    return { 
      ...super.toJSON(), 
      encodings, tracks, quantize
    }
  }

  source = SourceMash

  tracks: Track[] = []


  }
}
export function MashInstanceMixin
<T extends Constrained<Instance>>(Base: T): 
T & Constrained<MashInstance> {
  return class extends Base implements MashInstance {
    declare asset: MashAsset
  }
}