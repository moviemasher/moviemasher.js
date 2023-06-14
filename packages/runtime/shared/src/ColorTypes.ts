import type { Asset } from './AssetTypes.js'
import type { ImageAssetObject } from './ImageAsset.js'
import type { ImageInstanceObject } from './ImageInstance.js'
import type { Instance } from './Instance.js'

export interface ColorAsset extends Asset {
  color: string
}

export interface ColorInstance extends Instance {
  color: string
  asset: ColorAsset
}

export interface ColorInstanceObject extends ImageInstanceObject {
  color?: string
}

export interface ColorAssetObject extends ImageAssetObject {
  color?: string
}
