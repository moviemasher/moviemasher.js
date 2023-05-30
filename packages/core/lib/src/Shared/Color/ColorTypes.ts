
import type { ImageAsset, ImageAssetObject } from "../Image/ImageAsset.js"
import type { ImageInstance, ImageInstanceObject } from "../Image/ImageInstance.js"

export interface ColorAsset extends ImageAsset {
  color: string
  // instanceFromObject(object?: ColorInstanceObject): ColorInstance
}

export interface ColorInstance extends ImageInstance {
  color: string
  asset: ColorAsset
}

export interface ColorInstanceObject extends ImageInstanceObject {
  color?: string
}

export interface ColorAssetObject extends ImageAssetObject {
  color?: string
}
