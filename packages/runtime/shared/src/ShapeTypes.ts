import type { Asset, AssetObject } from './AssetTypes.js'
import type { Instance, InstanceObject } from './Instance.js'

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
