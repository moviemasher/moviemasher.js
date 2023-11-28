import type { Asset } from './AssetInterfaces.js'
import type { ImageAssetObject } from './ImageAsset.js'
import type { ImageInstanceObject } from './ImageInstance.js'
import type { Instance } from './InstanceTypes.js'

export interface ColorAsset extends Asset {}

export interface ColorInstance extends Instance {
  color: string
  asset: ColorAsset
}

export interface ColorInstanceObject extends ImageInstanceObject {
  color?: string
}

export interface ColorAssetObject extends ImageAssetObject {}
