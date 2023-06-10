import { 
  AssetObject} from "../Shared/Asset/AssetTypes.js"
import { AudioAssetObject } from "../Shared/Audio/AudioAsset.js"
import { ImageAssetObject } from "../Shared/Image/ImageAsset.js"
import { VideoAssetObject } from "../Shared/Video/VideoAsset.js"
import { 
  ServerAsset, ServerAudioAsset, ServerImageAsset, ServerVideoAsset 
} from "./Asset/ServerAsset.js"


export interface ServerAssetEventDetail {
  assetObject: AssetObject
  asset?: ServerAsset
}
export type ServerAssetEvent = CustomEvent<ServerAssetEventDetail>

export interface AudioServerAssetEventDetail {
  assetObject: AudioAssetObject
  asset?: ServerAudioAsset
}
export type AudioServerAssetEvent = CustomEvent<AudioServerAssetEventDetail>

export interface ServerImageAssetEventDetail {
  assetObject: ImageAssetObject
  asset?: ServerImageAsset
}
export type ServerImageAssetEvent = CustomEvent<ServerImageAssetEventDetail>

export interface ServerVideoAssetEventDetail {
  assetObject: VideoAssetObject
  asset?: ServerVideoAsset
}
export type ServerVideoAssetEvent = CustomEvent<ServerVideoAssetEventDetail>
