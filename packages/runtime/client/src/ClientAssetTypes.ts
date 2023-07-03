
import type { VisibleAsset, AudibleAsset, RawAssetObject } from '@moviemasher/runtime-shared'

import type { ClientAsset } from './ClientAsset.js'
import type { ClientAudioNode, ClientAudio, ClientImage, ClientVideo } from './ClientMedia.js'

export interface ClientAudibleAsset extends ClientAsset, AudibleAsset {
  audibleSource(): ClientAudioNode | undefined
  loadedAudio?: ClientAudio
}

export interface ClientVisibleAsset extends ClientAsset, VisibleAsset {}

export interface ClientRawAssetObject extends ClientRawAudioAssetObject, ClientRawImageAssetObject, ClientRawVideoAssetObject {}

export interface ClientRawAudioAssetObject extends RawAssetObject {
  loadedAudio?: ClientAudio
}

export interface ClientRawImageAssetObject extends RawAssetObject {
  loadedImage?: ClientImage
}

export interface ClientRawVideoAssetObject extends RawAssetObject {
  loadedVideo?: ClientVideo
}
