import { AssetType } from '@moviemasher/runtime-shared'
import { MovieMasher } from '@moviemasher/runtime-client'
import { ClientAsset, ClientAssets } from "../../../Client/ClientTypes.js"
import { AssetObject, AssetObjects } from '../../../Shared/Asset/Asset.js'
import { ClientAssetCollection } from './ClientAssetCollection.js'
import { AssetCollectionClass } from '../../../Shared/Asset/AssetCollection/AssetCollectionClass.js'
import { AssetEventDetail } from '../../../declarations.js'
import { assertClientAsset, isClientAsset } from '../../ClientGuards.js'
import { errorThrow } from '../../../Helpers/Error/ErrorFunctions.js'


export class ClientAssetCollectionClass extends AssetCollectionClass implements ClientAssetCollection {
  protected asset(object: AssetObject): ClientAsset {
    const detail: AssetEventDetail = { assetObject: object }
    const event = new CustomEvent('asset', { detail })
    MovieMasher.dispatch(event)
    const { asset } = event.detail
    if (!isClientAsset(asset)) {
      console.error('asset', object, asset)
      throw(new Error(`Could not create asset from object ${JSON.stringify(object)}`))
    }
    return asset
  }

  protected byType(type: AssetType): ClientAssets {
    return super.byType(type) as ClientAssets

  }

  define(media: AssetObject | AssetObjects): ClientAssets {
    return super.define(media) as ClientAssets
  }


  fromId(id: string): ClientAsset {
    return super.fromId(id) as ClientAsset
  }

  fromObject(object: AssetObject): ClientAsset {
    return super.fromObject(object) as ClientAsset
  }

  install(media: ClientAsset | ClientAssets): ClientAssets {
    return super.install(media) as ClientAssets
  }
}
