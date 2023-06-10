import type { AssetObject, AssetObjects } from '../../../Shared/Asset/AssetTypes.js'
import type { AssetManager } from '../../../Shared/Asset/AssetManager/AssetManagerTypes.js'
import { ServerAsset, ServerAssets } from '../ServerAsset.js'

export interface ServerAssetManager extends AssetManager {
  define(object: AssetObject | AssetObjects): ServerAssets
  fromId(id: string): ServerAsset
  fromObject(object: AssetObject): ServerAsset
  install(asset: ServerAsset | ServerAssets): ServerAssets
}
