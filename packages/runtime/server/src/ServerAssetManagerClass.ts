import type { AssetObject, ManageType } from '@moviemasher/runtime-shared'
import type { ServerAsset, ServerAssets } from './ServerAsset.js'
import type { ServerAssetManager } from './ServerAssetManager.js'
import { AssetManagerClass } from '@moviemasher/runtime-shared'
import { isServerAsset } from './ServerGuards.js'
import { EventAsset, EventManagedAsset, EventReleaseManagedAssets } from './ServerEvents.js'
import { MovieMasher } from './MovieMasher.js'

export class ServerAssetManagerClass extends AssetManagerClass implements ServerAssetManager {
  protected override asset(object: AssetObject): ServerAsset {
    const event = new EventAsset(object)
    MovieMasher.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    if (isServerAsset(asset)) this.install(asset)

    return asset as ServerAsset
  }

  protected context = 'server'

  override define(media: string | AssetObject, manageType?: ManageType): ServerAsset {
    return super.define(media, manageType) as ServerAsset
  }

  override fromId(id: string): ServerAsset {
    return super.fromId(id) as ServerAsset
  }

  override install(media: ServerAsset | ServerAssets): ServerAssets {
    return super.install(media) as ServerAssets
  }

  static handleManagedAsset(event: EventManagedAsset) {
    const { instance } = ServerAssetManagerClass
    const { detail } = event
    const { assetObject, assetId } = detail
    detail.asset = instance.define(assetObject || assetId)
    event.stopImmediatePropagation()
  }


  static handleReleaseAssets(event: EventReleaseManagedAssets) {
    const { instance } = ServerAssetManagerClass
    const { detail: manageType } = event
    instance.undefine(manageType)
    event.stopImmediatePropagation()
  }
  
  private static _instance?: ServerAssetManagerClass
  static get instance(): ServerAssetManagerClass {
    return this._instance ||= new ServerAssetManagerClass()
  }
}

MovieMasher.eventDispatcher.addDispatchListener(
  EventManagedAsset.Type, ServerAssetManagerClass.handleManagedAsset
)


// listen for release assets event
MovieMasher.eventDispatcher.addDispatchListener(
  EventReleaseManagedAssets.Type, ServerAssetManagerClass.handleReleaseAssets
)

