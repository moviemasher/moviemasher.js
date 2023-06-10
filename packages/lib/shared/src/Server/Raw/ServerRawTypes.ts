import type { RawAsset } from '../../Shared/Raw/RawTypes.js'
import type { ImageInstance, ImageInstanceObject } from '../../Shared/Image/ImageInstance.js'
import type { Instance, InstanceArgs, InstanceObject } from '../../Shared/Instance/Instance.js'
import type { VideoInstance, VideoInstanceObject } from '../../Shared/Video/VideoInstance.js'
import type { AudioInstance, AudioInstanceObject } from '../../Shared/Audio/AudioInstance.js'
import type { ServerEffects } from '../../Effect/Effect.js'
import type { ServerAsset, ServerAudioAsset, ServerImageAsset, ServerVideoAsset } from '../Asset/ServerAsset.js'
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
  effects: ServerEffects
}

export interface ServerRawAudioInstance extends AudioInstance, ServerInstance {
  asset: ServerRawAudioAsset
  effects: ServerEffects
}

export interface ServerRawImageInstance extends ImageInstance, ServerInstance {
  asset: ServerRawImageAsset
  effects: ServerEffects
}

export interface ServerRawVideoInstance extends VideoInstance, ServerInstance {
  asset: ServerRawVideoAsset
  effects: ServerEffects
}
