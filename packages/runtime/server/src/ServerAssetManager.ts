import type { AssetObject, AssetObjects } from '@moviemasher/runtime-shared'
import type { AssetManager } from '@moviemasher/runtime-shared'
import { ServerAsset, ServerAssets } from "./ServerAsset.js"

export interface ServerAssetManager extends AssetManager {
  define(object: AssetObject | AssetObjects): ServerAssets
  fromId(id: string): ServerAsset
  install(asset: ServerAsset | ServerAssets): ServerAssets
}
