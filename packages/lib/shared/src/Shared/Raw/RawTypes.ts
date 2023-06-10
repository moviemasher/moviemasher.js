import type { EndpointRequest } from '@moviemasher/runtime-shared'

import type { Asset, AssetObject } from '../Asset/AssetTypes.js'
import type { AudioAssetObject } from '../Audio/AudioAsset.js'
import type { ImageAssetObject } from '../Image/ImageAsset.js'
import type { VideoAssetObject } from '../Video/VideoAsset.js'

export interface RawAsset extends Asset {
  request: EndpointRequest
}

export type RawAssets = RawAsset[]

export interface RawAssetObject extends AssetObject {
  request: EndpointRequest
}

export interface RawAudioAssetObject extends RawAssetObject, AudioAssetObject {}

export interface RawImageAssetObject extends RawAssetObject, ImageAssetObject {}

export interface RawVideoAssetObject extends RawAssetObject, VideoAssetObject {}
