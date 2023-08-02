import { AssetManager, AssetObject, AssetObjects, ManageType } from '@moviemasher/runtime-shared'
import { ClientAssets, ClientAsset } from './ClientAsset.js'

export interface ClientAssetManager extends AssetManager {
  define(object: string | AssetObject, manageType?: ManageType): ClientAsset
  fromId(id: string): ClientAsset
  install(asset: ClientAsset | ClientAssets): ClientAssets
}
