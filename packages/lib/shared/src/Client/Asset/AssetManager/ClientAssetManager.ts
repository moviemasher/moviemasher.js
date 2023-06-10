import type { AssetObject, AssetObjects } from '../../../Shared/Asset/AssetTypes.js'
import type { AssetManager } from '../../../Shared/Asset/AssetManager/AssetManagerTypes.js'
import type { ClientAsset, ClientAssets } from '../../ClientTypes.js'

export interface ClientAssetManager extends AssetManager {
  define(object: AssetObject | AssetObjects): ClientAssets
  fromId(id: string): ClientAsset
  fromObject(object: AssetObject): ClientAsset
  install(asset: ClientAsset | ClientAssets): ClientAssets
}
