
import type { VisibleAsset, AudibleAsset } from '../../Shared/Asset/AssetTypes.js'
import type { ClientAudio, ClientAudioNode, ClientImage, ClientVideo } from '../../Helpers/ClientMedia/ClientMedia.js'
import type { RawAssetObject } from '../../Shared/Raw/RawTypes.js'
import { ClientAsset } from '../ClientTypes.js'


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
