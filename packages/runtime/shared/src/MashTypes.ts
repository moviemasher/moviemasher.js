import { AVType } from './AVType.js'
import { AssetManager } from './AssetManagerTypes.js'
import { Asset, AssetObject, AssetObjects } from './AssetTypes.js'
import { AudioAssetObject } from './AudioAsset.js'
import { Clips, Clip } from './Clip.js'
import { ClipObject } from './ClipObject.js'
import { UnknownRecord } from './Core.js'
import { Encodings, EncodingObjects } from './Encoding.js'
import { ImageAssetObject } from './ImageAsset.js'
import { Instance } from './Instance.js'
import { Size } from './Size.js'
import { Time } from './Time.js'
import { Track, TrackArgs, TrackObject } from './Track.js'
import { VideoAssetObject } from './VideoAsset.js'

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
