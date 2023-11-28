import type { Asset, AssetObject } from './AssetInterfaces.js'
import type { AudioAssetObject } from './AudioAsset.js'
import type { ImageAssetObject } from './ImageAsset.js'
import type { EndpointRequest } from './Request.js'
import type { VideoAssetObject } from './VideoAsset.js'

export interface PromptAsset extends Asset {
  request: EndpointRequest
}

export interface PromptAssets extends Array<PromptAsset>{}

export interface PromptAssetObject extends AssetObject {
  request: EndpointRequest
}

export interface PromptAudioAssetObject extends PromptAssetObject, AudioAssetObject {}

export interface PromptImageAssetObject extends PromptAssetObject, ImageAssetObject {}

export interface PromptVideoAssetObject extends PromptAssetObject, VideoAssetObject {}

