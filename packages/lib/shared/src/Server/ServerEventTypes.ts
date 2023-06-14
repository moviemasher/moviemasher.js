import { 
  AssetObject} from "@moviemasher/runtime-shared"
import { AudioAssetObject } from "@moviemasher/runtime-shared"
import { ImageAssetObject } from "@moviemasher/runtime-shared"
import { VideoAssetObject } from "@moviemasher/runtime-shared"
import { 
  ServerAudioAsset, ServerImageAsset, ServerVideoAsset 
} from "./Asset/ServerAssetTypes.js"
import { ServerAsset } from "@moviemasher/runtime-server"


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
