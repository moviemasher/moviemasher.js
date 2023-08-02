import type { AssetObject, ManageType } from '@moviemasher/runtime-shared'
import type { AssetManager } from '@moviemasher/runtime-shared'
import { ServerAsset, ServerAssets } from './ServerAsset.js'

export interface ServerAssetManager extends AssetManager {
  define(object: string | AssetObject, manageType?: ManageType): ServerAsset
  fromId(id: string): ServerAsset
  install(asset: ServerAsset | ServerAssets): ServerAssets
}
