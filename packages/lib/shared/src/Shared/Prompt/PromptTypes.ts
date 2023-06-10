import type { EndpointRequest } from '@moviemasher/runtime-shared'

import type { Asset, AssetObject } from '../Asset/AssetTypes.js'
import type { AudioAssetObject } from '../Audio/AudioAsset.js'
import type { ImageAssetObject } from '../Image/ImageAsset.js'
import type { VideoAssetObject } from '../Video/VideoAsset.js'

export interface PromptAsset extends Asset {
  request: EndpointRequest
}

export type PromptAssets = PromptAsset[]

export interface PromptAssetObject extends AssetObject {
  request: EndpointRequest
}

export interface PromptAudioAssetObject extends PromptAssetObject, AudioAssetObject {}

export interface PromptImageAssetObject extends PromptAssetObject, ImageAssetObject {}

export interface PromptVideoAssetObject extends PromptAssetObject, VideoAssetObject {}

