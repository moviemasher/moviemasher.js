import type { AssetObject, Assets, Asset } from './AssetTypes.js'

export interface AssetManager {
  define(object: string | AssetObject, manageType?: ManageType): Asset
  fromId(id: string): Asset
  install(asset: Asset | Assets): Assets
  installed(id: string): boolean
  undefine(manageType?: ManageType): void
  
}

export type ManageType = string