
// declare global {
//   interface WindowEventMap {
//     'asset': AssetEvent
//     'asset-promise': AssetPromiseEvent
//     'clientaudio': ClientAudioEvent
//   }
// }

// import { ClientAudioEvent } from "./Helpers/ClientMedia/ClientMediaEvents.js"
import { 
  Asset, AssetObject  } from "./Shared/Asset/Asset.js"
import { AudioAsset, AudioAssetObject } from "./Shared/Audio/AudioAsset.js"
import {
  ImageAsset,
  ImageAssetObject
} from "./Shared/Image/ImageAsset.js"
import { VideoAsset, VideoAssetObject } from "./Shared/Video/VideoAsset.js"

export interface AssetEventDetail {
  assetObject: AssetObject
  asset?: Asset
}
export type AssetEvent = CustomEvent<AssetEventDetail>

export interface AudioAssetEventDetail {
  assetObject: AudioAssetObject
  asset?: AudioAsset
}
export type AudioAssetEvent = CustomEvent<AudioAssetEventDetail>

export interface ImageAssetEventDetail {
  assetObject: ImageAssetObject
  asset?: ImageAsset
}
export type ImageAssetEvent = CustomEvent<ImageAssetEventDetail>

export interface VideoAssetEventDetail {
  assetObject: VideoAssetObject
  asset?: VideoAsset
}
export type VideoAssetEvent = CustomEvent<VideoAssetEventDetail>

export interface AssetPromiseEventDetail {
  assetObject: AssetObject
  assetPromise?: Promise<Asset>
}
export type AssetPromiseEvent = CustomEvent<AssetPromiseEventDetail>

export interface AudioAssetPromiseEventDetail {
  assetObject: AudioAssetObject
  assetPromise?: Promise<AudioAsset>
}

export type AudioAssetPromiseEvent = CustomEvent<AudioAssetPromiseEventDetail>

export interface ImageAssetPromiseEventDetail {
  assetObject: ImageAssetObject
  assetPromise?: Promise<ImageAsset>
}

export type ImageAssetPromiseEvent = CustomEvent<ImageAssetPromiseEventDetail>

export interface VideoAssetPromiseEventDetail {
  assetObject: VideoAssetObject
  assetPromise?: Promise<VideoAsset>
}

export type VideoAssetPromiseEvent = CustomEvent<VideoAssetPromiseEventDetail>
