
import type { VisibleAsset, AudibleAsset } from '@moviemasher/runtime-shared'
import type { RawAssetObject } from '@moviemasher/runtime-shared'
import { ClientAsset } from "@moviemasher/runtime-client"

import type { ClientAudio, ClientAudioNode, ClientImage, ClientVideo } from '../../Helpers/ClientMedia/ClientMedia.js'

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
