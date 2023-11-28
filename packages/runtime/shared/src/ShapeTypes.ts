import type { Asset, AssetObject } from './AssetInterfaces.js'
import type { Instance, InstanceObject } from './InstanceTypes.js'

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
