import type { AssetObject, AssetObjects } from '../../../Shared/Asset/Asset.js'
import type { AssetCollection } from '../../../Shared/Asset/AssetCollection/AssetCollection.js'
import type { ClientAsset, ClientAssets } from '../../ClientTypes.js'

export interface ClientAssetCollection extends AssetCollection {
  define(object: AssetObject | AssetObjects): ClientAssets
  fromId(id: string): ClientAsset
  fromObject(object: AssetObject): ClientAsset
  install(asset: ClientAsset | ClientAssets): ClientAssets
}
