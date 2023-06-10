import type { Size, Time } from '@moviemasher/runtime-shared'
import type { ClientImage } from '../../Helpers/ClientMedia/ClientMedia.js'
import type { RawAsset } from '../../Shared/Raw/RawTypes.js'
import type { ClientAsset, ClientAudioAsset, ClientImageAsset, ClientInstance, ClientVideoAsset } from '../ClientTypes.js'
import type { ImageInstance, ImageInstanceObject } from '../../Shared/Image/ImageInstance.js'
import type { Instance, InstanceArgs, InstanceObject } from '../../Shared/Instance/Instance.js'
import type { VideoInstance, VideoInstanceObject } from '../../Shared/Video/VideoInstance.js'
import type { AudioInstance, AudioInstanceObject } from '../../Shared/Audio/AudioInstance.js'
import type { ClientEffects } from '../../Effect/Effect.js'

export interface ClientRawAsset extends RawAsset, ClientAsset {
  instanceFromObject(object?: InstanceObject): Instance
  instanceArgs(object?: InstanceObject): InstanceObject & InstanceArgs
}

export interface ClientRawAudioAsset extends ClientRawAsset, ClientAudioAsset {
  instanceFromObject(object?: AudioInstanceObject): AudioInstance
}

export interface ClientRawImageAsset extends ClientRawAsset, ClientImageAsset {
  instanceFromObject(object?: ImageInstanceObject): ImageInstance
}

export interface ClientRawVideoAsset extends ClientRawAsset, ClientVideoAsset {
  instanceFromObject(object?: VideoInstanceObject): VideoInstance
  loadedImagePromise(definitionTime: Time, outSize?: Size): Promise<ClientImage>
}

export interface ClientRawInstance extends Instance, ClientInstance {
  asset: ClientRawAsset
  effects: ClientEffects
}

export interface ClientRawAudioInstance extends AudioInstance, ClientInstance {
  asset: ClientRawAudioAsset
  effects: ClientEffects
}

export interface ClientRawImageInstance extends ImageInstance, ClientInstance {
  asset: ClientRawImageAsset
  effects: ClientEffects
}

export interface ClientRawVideoInstance extends VideoInstance, ClientInstance {
  asset: ClientRawVideoAsset
  effects: ClientEffects
}
