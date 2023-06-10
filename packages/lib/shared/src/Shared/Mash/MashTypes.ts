import { Size, Time, UnknownRecord } from '@moviemasher/runtime-shared'
import { Asset, AssetObject, AssetObjects } from '../Asset/AssetTypes.js'
import { AudioAssetObject } from "../Audio/AudioAsset.js"
import { ImageAssetObject } from "../Image/ImageAsset.js"
import { Instance } from '../Instance/Instance.js'
import { Track, TrackArgs, TrackObject } from './Track/Track.js'
import { AVType } from '../../Setup/AVType.js'
import { AssetManager } from '../Asset/AssetManager/AssetManagerTypes.js'
import { EncodingObjects, Encodings } from '../../Plugin/Encode/Encoding/Encoding.js'
import { VideoAssetObject } from '../Video/VideoAsset.js'
import { Clip, Clips } from './Clip/Clip.js'
import { ClipObject } from './Clip/ClipObject.js'

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
  loop: boolean
  media: AssetManager
  quantize: number
  toJSON(): UnknownRecord
  tracks: Track[]
  trackInstance(args: TrackArgs): Track
  clipInstance(object: ClipObject): Clip
}

export interface MashAssetObject extends AssetObject {
  color?: string
  quantize?: number
  tracks?: TrackObject[]
  media?: AssetObjects
  encodings?: EncodingObjects
  loop?: boolean
  buffer?: number
  size?: Size
}

export interface MashAudioAssetObject extends MashAssetObject, AudioAssetObject {}

export interface MashImageAssetObject extends MashAssetObject, ImageAssetObject {}

export interface MashVideoAssetObject extends MashAssetObject, VideoAssetObject {}

export interface MashInstance extends Instance {
  asset: MashAsset
}
