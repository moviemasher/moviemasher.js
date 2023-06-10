import type { AssetEventDetail, AssetObject, AssetObjects, ClientAsset, ClientAssets, ClientAssetManager } from '@moviemasher/lib-shared'
import { MovieMasher } from '@moviemasher/runtime-client'
import { AssetType } from '@moviemasher/runtime-shared'


import { isClientAsset, AssetManagerClass } from '@moviemasher/lib-shared'


export class ClientAssetManagerClass extends AssetManagerClass implements ClientAssetManager {
  protected override asset(object: AssetObject): ClientAsset {
    const detail: AssetEventDetail = { assetObject: object }
    const event = new CustomEvent('asset', { detail })
    MovieMasher.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    if (!isClientAsset(asset)) {
      console.error('asset', object, asset)
      throw(new Error(`Could not create asset from object ${JSON.stringify(object)}`))
    }
    return asset
  }

  protected override byType(type: AssetType): ClientAssets {
    return super.byType(type) as ClientAssets

  }

  override define(media: AssetObject | AssetObjects): ClientAssets {
    return super.define(media) as ClientAssets
  }


  override fromId(id: string): ClientAsset {
    return super.fromId(id) as ClientAsset
  }

  override fromObject(object: AssetObject): ClientAsset {
    return super.fromObject(object) as ClientAsset
  }

  override install(media: ClientAsset | ClientAssets): ClientAssets {
    return super.install(media) as ClientAssets
  }
}



MovieMasher.assetManager = new ClientAssetManagerClass()