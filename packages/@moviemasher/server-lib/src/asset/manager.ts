import type { Asset, AssetObject, ListenersFunction } from '@moviemasher/shared-lib/types.js'
import type { ServerAsset, ServerAssets } from '../types.js'

import { MOVIEMASHER, arrayFromOneOrMore, assertAsset } from '@moviemasher/shared-lib/runtime.js'
import { assertDefined } from '@moviemasher/shared-lib/utility/guards.js'
import { EventReleaseServerManagedAssets, EventServerAsset, EventServerManagedAsset, EventServerManagedAssetPromise, isServerAsset } from '../runtime.js'

export class ServerAssetManagerClass {
  private asset(object: string | AssetObject): ServerAsset | undefined{
    const event = new EventServerAsset(object)
    const handled = MOVIEMASHER.eventDispatcher.dispatch(event)
    if (!handled) return
    
    const { asset } = event.detail
    if (!isServerAsset(asset)) return
    
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

  static handleManagedAssetPromise(event: EventServerManagedAssetPromise) {
    const { instance } = ServerAssetManagerClass
    const { detail } = event
    const { assetObject, assetId: id } = detail
    assertDefined(id)
    
    let asset: Asset | undefined = instance.fromId(id)
    if (!asset) {
      const idOrObject = assetObject || id 
      assertDefined(idOrObject)

      asset = instance.asset(idOrObject)
    }
    assertAsset(asset)

    detail.promise = Promise.resolve({data: asset})
    event.stopImmediatePropagation()
  }

  static handleReleaseAssets(event: EventReleaseServerManagedAssets) {
    const { instance } = ServerAssetManagerClass
    instance.undefine()
    event.stopImmediatePropagation()
  }
  
  private static instance = new ServerAssetManagerClass()
}

export const ServerAssetManagerListeners: ListenersFunction = () => ({
  [EventServerManagedAsset.Type]: ServerAssetManagerClass.handleManagedAsset,
  [EventServerManagedAssetPromise.Type]: ServerAssetManagerClass.handleManagedAssetPromise,
  [EventReleaseServerManagedAssets.Type]: ServerAssetManagerClass.handleReleaseAssets,
})

