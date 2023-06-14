import type { RawAsset } from '@moviemasher/runtime-shared'
import type { ImageInstance, ImageInstanceObject } from '@moviemasher/runtime-shared'
import type { Instance, InstanceArgs, InstanceObject } from '@moviemasher/runtime-shared'
import type { VideoInstance, VideoInstanceObject } from '@moviemasher/runtime-shared'
import type { AudioInstance, AudioInstanceObject } from '@moviemasher/runtime-shared'
import type { ServerAudioAsset, ServerImageAsset, ServerVideoAsset } from '../Asset/ServerAssetTypes.js'
import type { ServerAsset } from "@moviemasher/runtime-server"
import type { ServerInstance } from '../ServerInstance.js'

export interface ServerRawAsset extends RawAsset, ServerAsset {
  instanceFromObject(object?: InstanceObject): Instance
  instanceArgs(object?: InstanceObject): InstanceObject & InstanceArgs
}

export interface ServerRawAudioAsset extends ServerRawAsset, ServerAudioAsset {
  instanceFromObject(object?: AudioInstanceObject): AudioInstance
}

export interface ServerRawImageAsset extends ServerRawAsset, ServerImageAsset {
  instanceFromObject(object?: ImageInstanceObject): ImageInstance
}

export interface ServerRawVideoAsset extends ServerRawAsset, ServerVideoAsset {
  instanceFromObject(object?: VideoInstanceObject): VideoInstance
}

export interface ServerRawInstance extends Instance, ServerInstance {
  asset: ServerRawAsset
}

export interface ServerRawAudioInstance extends AudioInstance, ServerInstance {
  asset: ServerRawAudioAsset
}

export interface ServerRawImageInstance extends ImageInstance, ServerInstance {
  asset: ServerRawImageAsset
}

export interface ServerRawVideoInstance extends VideoInstance, ServerInstance {
  asset: ServerRawVideoAsset
}
