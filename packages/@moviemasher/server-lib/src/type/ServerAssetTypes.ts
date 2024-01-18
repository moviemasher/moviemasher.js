import type { ServerAsset } from '../types.js'
import type { AudibleAsset, AudibleAssetObject, AudioAsset, AudioAssetObject, AudioInstance, AudioInstanceObject, ImageAsset, ImageInstance, ImageInstanceObject, InstanceArgs, Size, VideoAsset, VideoAssetObject, VideoInstance, VideoInstanceObject, VisibleAsset, VisibleAssetObject } from '@moviemasher/shared-lib/types.js'

export interface ServerAudioAsset extends AudioAsset, ServerAudibleAsset {
  assetObject: AudioAssetObject
}
export interface ServerImageAsset extends ImageAsset, ServerVisibleAsset {}
export interface ServerVideoAsset extends VideoAsset, ServerAudibleAsset, ServerVisibleAsset {
  assetObject: VideoAssetObject
}

export interface ServerAudibleAsset extends ServerAsset, AudibleAsset {
  assetObject: AudibleAssetObject
}

export interface ServerVisibleAsset extends ServerAsset, VisibleAsset {
  assetObject: VisibleAssetObject
}
