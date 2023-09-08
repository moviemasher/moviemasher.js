import type { ServerAsset, ServerMediaRequest } from "@moviemasher/runtime-server"
import type { AudioInstance, AudioInstanceObject, ImageInstance, ImageInstanceObject, Instance, InstanceArgs, InstanceObject, RawAsset, VideoInstance, VideoInstanceObject } from '@moviemasher/runtime-shared'
import type { ServerInstance } from './ServerInstanceTypes.js'
import type { ServerAudioAsset, ServerImageAsset, ServerVideoAsset } from './ServerAssetTypes.js'

export interface ServerRawAsset extends RawAsset, ServerAsset {
  instanceFromObject(object?: InstanceObject): Instance
  instanceArgs(object?: InstanceObject): InstanceObject & InstanceArgs
  request: ServerMediaRequest
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
