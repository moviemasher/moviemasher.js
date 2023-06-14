import type { Asset, AssetObject } from './AssetTypes.js'
import type { ImageInstanceObject, ImageInstance } from './ImageInstance.js'
import type { InstanceArgs } from './Instance.js'

export interface ImageAsset extends Asset {
  instanceFromObject(object?: ImageInstanceObject): ImageInstance
  instanceArgs(object?: ImageInstanceObject): ImageInstanceObject & InstanceArgs
}

export interface ImageAssetObject extends AssetObject { }
