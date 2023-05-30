import { Size, Time, UnknownRecord } from '@moviemasher/runtime-shared'
import { Asset, AssetObject, AssetObjects } from '../Asset/Asset.js'
import { AudioAsset } from "../Audio/AudioAsset.js"
import { ImageAsset } from "../Image/ImageAsset.js"
import { Instance, InstanceArgs } from '../Instance/Instance.js'
import { ImageInstance, ImageInstanceObject } from "../Image/ImageInstance.js"
import { Track, TrackObject } from './Track/Track.js'
import { AVType } from '../../Setup/AVType.js'
import { MashingType } from '../../Plugin/Masher/Masher.js'
import { AssetCollection } from '../Asset/AssetCollection/AssetCollection.js'
import { EncodingObjects, Encodings } from '../../Plugin/Encode/Encoding/Encoding.js'
import { VideoAsset } from '../Video/VideoAsset.js'
import { AudioInstance } from '../Audio/AudioInstance.js'
import { VideoInstance } from '../Video/VideoInstance.js'
import { Clips } from './Clip/Clip.js'

export type Interval = ReturnType<typeof setInterval>


export interface MashAsset extends Asset { 
  // gain: number
  clips: Clips
  clipsAudibleInTime(time: Time): Clips
  clipsInTimeOfType(time: Time, avType?: AVType): Clips
  color: string
  duration: number
  encodings: Encodings
  endTime: Time
  totalFrames: number
  imageSize: Size
  kind: MashingType
  loop: boolean
  media: AssetCollection
  quantize: number
  toJSON(): UnknownRecord
  tracks: Track[]
}


export interface MashAssetObject extends AssetObject {
  color?: string
  quantize?: number
  tracks?: TrackObject[]
  media?: AssetObjects
  encodings?: EncodingObjects

  size?: Size
}

export interface MashAudioAsset extends MashAsset, AudioAsset {
  instanceFromObject(object?: MashInstanceObject): MashAudioInstance
  instanceArgs(object?: MashInstanceObject): MashInstanceObject & InstanceArgs
}

export interface MashImageAsset extends MashAsset, ImageAsset {
  instanceFromObject(object?: MashInstanceObject): MashImageInstance
  instanceArgs(object?: MashInstanceObject): MashInstanceObject & InstanceArgs
}

export interface MashVideoAsset extends MashAsset, VideoAsset {
  instanceFromObject(object?: MashInstanceObject): MashVideoInstance
  instanceArgs(object?: MashInstanceObject): MashInstanceObject & InstanceArgs
}

export interface MashInstance extends Instance {
  asset: MashAsset
}

export interface MashAudioInstance extends MashInstance, AudioInstance {
  asset: MashAudioAsset
}

export interface MashImageInstance extends MashInstance, ImageInstance {
  asset: MashImageAsset
}

export interface MashVideoInstance extends MashInstance, VideoInstance {
  asset: MashVideoAsset
}

export interface MashImageInstance extends MashInstance, ImageInstance {
  asset: MashImageAsset
}

export interface MashInstanceObject extends ImageInstanceObject {}