import type {
  AssetEventDetail, AssetObject, AssetObjects, AssetType, MovieMasherRuntime, RequestObject
} from '@moviemasher/runtime-shared'

import type { ClientAsset, ClientAssets } from './ClientAsset.js'
import type { ClientAssetManager } from './ClientAssetManager.js'
import type { Masher } from './Masher.js'

import { AssetManagerClass, EventTypeAsset } from '@moviemasher/runtime-shared'
import { ClientEventDispatcher } from './ClientEventDispatcher.js'
import { isClientAsset } from './ClientGuards.js'

export interface MovieMasherClientRuntime extends MovieMasherRuntime {
  assetManager: ClientAssetManager
  masher?: Masher
  options: {
    assetObjectOptions?: RequestObject
    assetObjectsOptions?: RequestObject
    iconOptions?: RequestObject

  }
}

export class ClientAssetManagerClass extends AssetManagerClass implements ClientAssetManager {
  protected override asset(object: AssetObject): ClientAsset {
    const detail: AssetEventDetail = { assetObject: object }
    const event = new CustomEvent(EventTypeAsset, { detail })
    MovieMasher.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    if (isClientAsset(asset)) {

      this.install(asset)
    }
    return asset as ClientAsset
  }

  protected override byType(type: AssetType): ClientAssets {
    return super.byType(type) as ClientAssets
  }

  protected context = 'client'
  
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
  options: {},
}

