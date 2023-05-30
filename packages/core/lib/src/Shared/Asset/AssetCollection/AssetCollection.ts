import { Asset, AssetObject, AssetObjects, Assets } from '../Asset.js'

export interface AssetCollectionBase {
  fromId(id: string): Asset
  installed(id: string): boolean
  updateDefinitionId(oldId: string, newId: string): void
  undefineAll(): void
}
export interface AssetCollection extends AssetCollectionBase {
  define(object: AssetObject | AssetObjects): Assets
  fromObject(object: AssetObject): Asset
  install(asset: Asset | Assets): Assets

}
