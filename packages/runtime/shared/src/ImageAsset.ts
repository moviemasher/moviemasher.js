import type { Asset, AssetObject } from './AssetInterfaces.js'
import type { ImageInstanceObject, ImageInstance } from './ImageInstance.js'
import type { InstanceArgs } from './InstanceTypes.js'

export interface ImageAsset extends Asset {
  instanceFromObject(object?: ImageInstanceObject): ImageInstance
  instanceArgs(object?: ImageInstanceObject): ImageInstanceObject & InstanceArgs
}

export interface ImageAssetObject extends AssetObject { }
