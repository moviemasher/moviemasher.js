import type { VisibleAsset, AudibleAsset } from '@moviemasher/runtime-shared'
import type { AudioAsset } from '@moviemasher/runtime-shared'
import type { ImageAsset } from '@moviemasher/runtime-shared'
import { InstanceArgs } from '@moviemasher/runtime-shared'
import { ImageInstance, ImageInstanceObject } from '@moviemasher/runtime-shared'
import { AudioInstance, AudioInstanceObject } from '@moviemasher/runtime-shared'
import { VideoInstance, VideoInstanceObject } from '@moviemasher/runtime-shared'
import { VideoAsset } from '@moviemasher/runtime-shared'
import { ServerAsset } from "@moviemasher/runtime-server"

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