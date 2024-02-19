import type { AssetObject, ListenersFunction } from '@moviemasher/shared-lib/types.js'
import type { ServerAsset, ServerAssetManager, ServerAssets } from '../types.js'

import { MOVIEMASHER, arrayFromOneOrMore, isAsset } from '@moviemasher/shared-lib/runtime.js'
import { assertDefined } from '@moviemasher/shared-lib/utility/guards.js'
import { isServerAsset } from '../utility/guard.js'
import { EventReleaseServerManagedAssets, EventServerAsset, EventServerManagedAsset } from '../utility/events.js'
import { isString } from '@moviemasher/shared-lib/utility/guard.js'

export class ServerAssetManagerClass implements ServerAssetManager {
  asset(object: string | AssetObject): ServerAsset | undefined {
    const id = isString(object) ? object : object.id
    const installed = this.fromId(id)
    if (installed) return installed

    const event = new EventServerAsset(object, this)
    const handled = MOVIEMASHER.dispatch(event)
    if (!handled) {
      console.log('ServerAssetManagerClass asset NOT HANDLED', EventServerAsset.Type, event.detail)
      return
    }
    const { asset } = event.detail
    if (!isServerAsset(asset)) {
      console.log('ServerAssetManagerClass asset NOT SERVER ASSET', asset, isAsset(asset), asset && 'assetFiles' in asset)
      return
    }
    this.install(asset)
    return asset 
  }

  private assetsById = new Map<string, ServerAsset>()

  private fromId(id: string): ServerAsset | undefined {
    return this.assetsById.get(id)
  }

  private install(asset: ServerAsset | ServerAssets): ServerAssets {
    const assets = arrayFromOneOrMore(asset) 
    return assets.map(asset => {
      const { id } = asset
      const existing = this.fromId(id)
      if (existing) return existing

      // console.log('ServerAssetManagerClass install', id)
      this.assetsById.set(id, asset)
      return asset
    })
  }

  private undefine() {
    this.assetsById = new Map<string, ServerAsset>()
  }

  static handleManagedAsset(event: EventServerManagedAsset) {
    const { instance } = ServerAssetManagerClass
    const { detail } = event
    const { assetObject, assetId } = detail
    const id = assetId || assetObject?.id
    assertDefined(id)
    
    detail.asset = instance.fromId(id)
    // console.log('ServerAssetManagerClass handleManagedAsset', id, !!detail.asset)
    if (!detail.asset) {
      const idOrObject = assetObject || assetId 
      assertDefined(idOrObject)

      detail.asset = instance.asset(idOrObject)
      // console.log('ServerAssetManagerClass handleManagedAsset', !!detail.asset)
    }
    event.stopImmediatePropagation()
  }

  static handleReleaseAssets(event: EventReleaseServerManagedAssets) {
    const { instance } = ServerAssetManagerClass
    instance.undefine()
    event.stopImmediatePropagation()
  }
  
  private static get instance() { return new ServerAssetManagerClass() }
}

export const ServerAssetManagerListeners: ListenersFunction = () => ({
  [EventServerManagedAsset.Type]: ServerAssetManagerClass.handleManagedAsset,
  // [EventServerManagedAssetPromise.Type]: ServerAssetManagerClass.handleManagedAssetPromise,
  [EventReleaseServerManagedAssets.Type]: ServerAssetManagerClass.handleReleaseAssets,
})
