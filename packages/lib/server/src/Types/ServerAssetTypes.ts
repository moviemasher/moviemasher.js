import type { ServerAsset } from '@moviemasher/runtime-server'
import type { AudibleAsset, AudioAsset, AudioInstance, AudioInstanceObject, ImageAsset, ImageInstance, ImageInstanceObject, InstanceArgs, Size, VideoAsset, VideoInstance, VideoInstanceObject, VisibleAsset } from '@moviemasher/runtime-shared'

export interface ServerAudioAsset extends AudioAsset, ServerAudibleAsset {
  instanceFromObject(object: AudioInstanceObject): AudioInstance
  instanceArgs(object?: AudioInstanceObject): AudioInstanceObject & InstanceArgs
}
export interface ServerImageAsset extends ImageAsset, ServerVisibleAsset {
  instanceFromObject(object: ImageInstanceObject): ImageInstance
  instanceArgs(object?: ImageInstanceObject): ImageInstanceObject & InstanceArgs
 }
export interface ServerVideoAsset extends VideoAsset, ServerAudibleAsset, ServerVisibleAsset {
  instanceFromObject(object: VideoInstanceObject): VideoInstance
  instanceArgs(object?: VideoInstanceObject): VideoInstanceObject & InstanceArgs
}

export interface ServerAudibleAsset extends ServerAsset, AudibleAsset {}

export interface ServerVisibleAsset extends ServerAsset, VisibleAsset {}
