import { AssetManager, AssetObject, AssetObjects } from '@moviemasher/runtime-shared'
import { ClientAssets, ClientAsset } from './ClientAsset.js'

export interface ClientAssetManager extends AssetManager {
  define(object: AssetObject | AssetObjects): ClientAssets
  fromId(id: string): ClientAsset
  install(asset: ClientAsset | ClientAssets): ClientAssets
}
