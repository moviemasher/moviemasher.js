import type { AudioInstance, AudioInstanceObject, DataOrError, ImageInstance, ImageInstanceObject, Instance, InstanceArgs, InstanceObject, RawAsset, Size, Time, TranscodingTypes, VideoInstance, VideoInstanceObject } from '@moviemasher/runtime-shared'
import type { ClientAsset } from './ClientAsset.js'
import type { ClientClip } from './ClientMashTypes.js'
import type { ClientImage } from './ClientMedia.js'
import type { ClientAudioAsset, ClientImageAsset, ClientInstance, ClientVideoAsset } from './ClientTypes.js'
import type { Transcoding, Transcodings } from '@moviemasher/runtime-shared'

export interface ClientRawAsset extends RawAsset, ClientAsset {
  instanceFromObject(object?: InstanceObject): Instance
  instanceArgs(object?: InstanceObject): InstanceObject & InstanceArgs
  preferredTranscoding(...types: TranscodingTypes): Transcoding | undefined
  transcodings: Transcodings
}

export interface ClientRawAudioAsset extends ClientRawAsset, ClientAudioAsset {
  instanceFromObject(object?: AudioInstanceObject): AudioInstance
}

export interface ClientRawImageAsset extends ClientRawAsset, ClientImageAsset {
  instanceFromObject(object?: ImageInstanceObject): ImageInstance
}

export interface ClientRawVideoAsset extends ClientRawAsset, ClientVideoAsset {
  instanceFromObject(object?: VideoInstanceObject): VideoInstance
  loadedImagePromise(definitionTime: Time, outSize?: Size): Promise<DataOrError<ClientImage>>
}

export interface ClientRawInstance extends Instance, ClientInstance {
  clip: ClientClip
  asset: ClientRawAsset
}

export interface ClientRawAudioInstance extends AudioInstance, ClientInstance {
  clip: ClientClip
  asset: ClientRawAudioAsset
}

export interface ClientRawImageInstance extends ImageInstance, ClientInstance {
  clip: ClientClip
  asset: ClientRawImageAsset
}

export interface ClientRawVideoInstance extends VideoInstance, ClientInstance {
  clip: ClientClip
  asset: ClientRawVideoAsset
}
