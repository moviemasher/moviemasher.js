import type { Asset, AssetObject } from '../Asset/Asset.js'
import type { Instance, InstanceObject } from '../Instance/Instance.js'

export interface ShapeAsset extends Asset {
  path: string
  pathWidth: number
  pathHeight: number
}

export interface ShapeInstance extends Instance {
  asset: ShapeAsset
}

export interface ShapeInstanceObject extends InstanceObject {}

export interface ShapeAssetObject extends AssetObject {
  pathWidth?: number
  pathHeight?: number
  path?: string
}
