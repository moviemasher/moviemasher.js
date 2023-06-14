import type { Size, Time } from '@moviemasher/runtime-shared'
import type { ClientImage } from '../../Helpers/ClientMedia/ClientMedia.js'
import type { RawAsset } from '@moviemasher/runtime-shared'
import type { ClientAudioAsset, ClientImageAsset, ClientInstance, ClientVideoAsset } from '../ClientTypes.js'
import type { ClientAsset } from "@moviemasher/runtime-client"
import type { ImageInstance, ImageInstanceObject } from '@moviemasher/runtime-shared'
import type { Instance, InstanceArgs, InstanceObject } from '@moviemasher/runtime-shared'
import type { VideoInstance, VideoInstanceObject } from '@moviemasher/runtime-shared'
import type { AudioInstance, AudioInstanceObject } from '@moviemasher/runtime-shared'

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
}

export interface ClientRawAudioInstance extends AudioInstance, ClientInstance {
  asset: ClientRawAudioAsset
}

export interface ClientRawImageInstance extends ImageInstance, ClientInstance {
  asset: ClientRawImageAsset
}

export interface ClientRawVideoInstance extends VideoInstance, ClientInstance {
  asset: ClientRawVideoAsset
}
