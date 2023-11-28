
import type { AudibleAsset, RawAssetObject, Size, Transcodings, VisibleAsset } from '@moviemasher/runtime-shared'
import type { ClientAsset } from './ClientAsset.js'
import type { ClientImage, ClientMediaRequest, ClientVideo } from './ClientMedia.js'

export interface ClientAudibleAsset extends ClientAsset, AudibleAsset {
  audibleSource(): AudioBufferSourceNode | undefined
  loadedAudio?: AudioBuffer
}

export interface ClientVisibleAsset extends ClientAsset, VisibleAsset {
  previewSize?: Size
}

export interface ClientRawAssetObject extends ClientRawAudioAssetObject, ClientRawImageAssetObject, ClientRawVideoAssetObject {
  request: ClientMediaRequest
  transcodings?: Transcodings
}

export interface ClientRawAudioAssetObject extends RawAssetObject {
  loadedAudio?: AudioBuffer
}

export interface ClientRawImageAssetObject extends RawAssetObject {
  loadedImage?: ClientImage
}

export interface ClientRawVideoAssetObject extends RawAssetObject {
  loadedVideo?: ClientVideo
}
