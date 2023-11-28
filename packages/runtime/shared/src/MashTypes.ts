import { AVType } from './AVType.js'
import { Asset, AssetObject } from './AssetInterfaces.js'
import { AudioAssetObject } from './AudioAsset.js'
import { Clips, Clip } from './Clip.js'
import { ClipObject } from './ClipObject.js'
import { UnknownRecord } from './Core.js'
import { ImageAssetObject } from './ImageAsset.js'
import { Instance, InstanceObject } from './InstanceTypes.js'
import { Size } from './Size.js'
import { Time } from './Time.js'
import { Track, TrackArgs, TrackObject } from './Track.js'
import { VideoAssetObject } from './VideoAsset.js'

export interface MashAsset extends Asset { 
  // gain: number
  clipInstance(object: ClipObject): Clip
  clips: Clips
  clipsAudibleInTime(time: Time): Clips
  clipsInTimeOfType(time: Time, avType?: AVType): Clips
  color: string
  duration: number
  encoding: string
  endTime: Time
  loop: boolean
  quantize: number
  size: Size
  toJSON(): UnknownRecord
  totalFrames: number
  trackInstance(args: TrackArgs): Track
  tracks: Track[]
}

export interface MashAssetObject extends AssetObject {
  color?: string
  quantize?: number
  tracks?: TrackObject[]
  loop?: boolean
  buffer?: number
  aspectWidth?: number
  aspectHeight?: number
  aspectShortest?: number
  encoding?: string
}

export interface MashAudioAssetObject extends MashAssetObject, AudioAssetObject {}

export interface MashImageAssetObject extends MashAssetObject, ImageAssetObject {}

export interface MashVideoAssetObject extends MashAssetObject, VideoAssetObject {}

export interface MashInstance extends Instance {
  asset: MashAsset
}

export interface MashInstanceObject extends InstanceObject {
  
}
