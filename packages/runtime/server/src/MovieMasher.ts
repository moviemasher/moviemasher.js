import type { AssetEventDetail, AssetObject, AssetObjects, AssetType, MovieMasherRuntime } from '@moviemasher/runtime-shared'
import type { ServerAsset, ServerAssets } from './ServerAsset.js'
import type { ServerAssetManager } from './ServerAssetManager.js'

import { AssetManagerClass } from '@moviemasher/runtime-shared'
import { ServerEventDispatcher } from './ServerEventDispatcher.js'
import { MovieMasherServerRuntime } from './declarations.js'

export class ServerAssetManagerClass extends AssetManagerClass implements ServerAssetManager {
  protected override asset(object: AssetObject): ServerAsset {
    const detail: AssetEventDetail = { assetObject: object }
    const event = new CustomEvent('asset', { detail })
    MovieMasher.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    return asset as ServerAsset
  }

  override define(media: AssetObject | AssetObjects): ServerAssets {
    return super.define(media) as ServerAssets
  }

  override fromId(id: string): ServerAsset {
    return super.fromId(id) as ServerAsset
  }

  override install(media: ServerAsset | ServerAssets): ServerAssets {
    return super.install(media) as ServerAssets
  }
}


export const MovieMasher: MovieMasherServerRuntime = {
  eventDispatcher: new ServerEventDispatcher(),
  assetManager: new ServerAssetManagerClass(),
  masher: {}
}
