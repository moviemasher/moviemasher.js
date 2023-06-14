import type { AssetEventDetail, AssetObject, AssetObjects, AssetType } from '@moviemasher/runtime-shared'
import type { ClientAsset, ClientAssets } from './ClientAsset.js'
import type { ClientAssetManager } from './ClientAssetManager.js'
import type { MovieMasherClientRuntime } from './declarations.js'

import { AssetManagerClass } from '@moviemasher/runtime-shared'
import { ClientEventDispatcher } from './ClientEventDispatcher.js'

export class ClientAssetManagerClass extends AssetManagerClass implements ClientAssetManager {
  protected override asset(object: AssetObject): ClientAsset {
    const detail: AssetEventDetail = { assetObject: object }
    const event = new CustomEvent('asset', { detail })
    MovieMasher.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    return asset as ClientAsset
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

  override install(media: ClientAsset | ClientAssets): ClientAssets {
    return super.install(media) as ClientAssets
  }
}

export const MovieMasher: MovieMasherClientRuntime = {
  eventDispatcher: new ClientEventDispatcher(),
  assetManager: new ClientAssetManagerClass(),
  masher: {}
}

