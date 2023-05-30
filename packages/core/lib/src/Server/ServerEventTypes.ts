import { 
  AssetObject} from "../Shared/Asset/Asset.js"
import { AudioAssetObject } from "../Shared/Audio/AudioAsset.js"
import { ImageAssetObject } from "../Shared/Image/ImageAsset.js"
import { VideoAssetObject } from "../Shared/Video/VideoAsset.js"
import { 
  ServerAsset, AudioServerAsset, ImageServerAsset, VideoServerAsset 
} from "./ServerAsset.js"


export interface ServerAssetEventDetail {
  assetObject: AssetObject
  asset?: ServerAsset
}
export type ServerAssetEvent = CustomEvent<ServerAssetEventDetail>

export interface AudioServerAssetEventDetail {
  assetObject: AudioAssetObject
  asset?: AudioServerAsset
}
export type AudioServerAssetEvent = CustomEvent<AudioServerAssetEventDetail>

export interface ImageServerAssetEventDetail {
  assetObject: ImageAssetObject
  asset?: ImageServerAsset
}
export type ImageServerAssetEvent = CustomEvent<ImageServerAssetEventDetail>

export interface VideoServerAssetEventDetail {
  assetObject: VideoAssetObject
  asset?: VideoServerAsset
}
export type VideoServerAssetEvent = CustomEvent<VideoServerAssetEventDetail>
