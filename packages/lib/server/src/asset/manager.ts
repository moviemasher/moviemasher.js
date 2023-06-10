import { AssetType } from '@moviemasher/runtime-shared'
import { MovieMasher } from '@moviemasher/runtime-server'

import { AssetEventDetail,AssetManagerClass,
  ServerAssetManager, ServerAsset, ServerAssets,
  AssetObject, AssetObjects, assertAsset,

} from '@moviemasher/lib-shared'


export class ServerAssetManagerClass extends AssetManagerClass implements ServerAssetManager {
  protected asset(object: AssetObject): ServerAsset {
    const detail: AssetEventDetail = { assetObject: object }
    const event = new CustomEvent('asset', { detail })
    MovieMasher.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    assertAsset(asset)
    return asset as ServerAsset
  }

  protected byType(type: AssetType): ServerAssets {
    return super.byType(type) as ServerAssets

  }

  define(media: AssetObject | AssetObjects): ServerAssets {
    return super.define(media) as ServerAssets
  }


  fromId(id: string): ServerAsset {
    return super.fromId(id) as ServerAsset
  }

  fromObject(object: AssetObject): ServerAsset {
    return super.fromObject(object) as ServerAsset
  }

  install(media: ServerAsset | ServerAssets): ServerAssets {
    return super.install(media) as ServerAssets
  }
}

MovieMasher.assetManager = new ServerAssetManagerClass()