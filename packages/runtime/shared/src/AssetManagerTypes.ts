import type { AssetObject, AssetObjects, Assets, Asset } from './AssetTypes.js'

export interface AssetManager {
  assetPromise(object: AssetObject): Promise<Asset>
  define(object: AssetObject | AssetObjects): Assets
  fromId(id: string): Asset
  install(asset: Asset | Assets): Assets
  installed(id: string): boolean
  undefineAll(): void
  updateDefinitionId(oldId: string, newId: string): void
  predefine(id: string, asset: Asset): void
}
