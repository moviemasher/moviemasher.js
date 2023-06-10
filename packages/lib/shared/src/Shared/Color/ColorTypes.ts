
import type { Asset } from "../Asset/AssetTypes.js"
import type { ImageAssetObject } from "../Image/ImageAsset.js"
import type { ImageInstanceObject } from "../Image/ImageInstance.js"
import type { Instance } from "../Instance/Instance.js"

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
