import type { Asset, AssetObject } from './AssetInterfaces.js'
import type { AudioAssetObject } from './AudioAsset.js'
import type { ImageAssetObject } from './ImageAsset.js'
import { InstanceObject } from './InstanceTypes.js'
import type { EndpointRequest } from './Request.js'
import type { VideoAssetObject } from './VideoAsset.js'

export interface RawAsset extends Asset {
  request: EndpointRequest
}

export interface RawAssets extends Array<RawAsset>{}

export interface RawAssetObject extends AssetObject {
  request: EndpointRequest
}

export interface RawAudioAssetObject extends RawAssetObject, AudioAssetObject {}

export interface RawImageAssetObject extends RawAssetObject, ImageAssetObject {}

export interface RawVideoAssetObject extends RawAssetObject, VideoAssetObject {}

export interface RawInstanceObject extends InstanceObject {
  
}