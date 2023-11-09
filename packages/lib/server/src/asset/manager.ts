import type { ServerAsset, ServerAssets } from '@moviemasher/runtime-server'
import type { AssetObject } from '@moviemasher/runtime-shared'

import { arrayFromOneOrMore, assertDefined } from '@moviemasher/lib-shared'
import { EventReleaseServerManagedAssets, EventServerAsset, EventServerManagedAsset, MovieMasher, isServerAsset } from '@moviemasher/runtime-server'

export class ServerAssetManagerClass {
  private asset(object: string | AssetObject): ServerAsset | undefined{
    const event = new EventServerAsset(object)
    MovieMasher.eventDispatcher.dispatch(event)
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
    // console.debug('ServerAssetManagerClass handleManagedAsset', id, !!detail.asset)
    if (!detail.asset) {
      const idOrObject = assetObject || assetId 
      assertDefined(idOrObject)

      detail.asset = instance.asset(idOrObject)
    }
    event.stopImmediatePropagation()
  }

  static handleReleaseAssets(event: EventReleaseServerManagedAssets) {
    const { instance } = ServerAssetManagerClass
    instance.undefine()
    event.stopImmediatePropagation()
  }
  
  private static instance = new ServerAssetManagerClass()
}

export const ServerAssetManagerListeners = () => ({
  [EventServerManagedAsset.Type]: ServerAssetManagerClass.handleManagedAsset,
  [EventReleaseServerManagedAssets.Type]: ServerAssetManagerClass.handleReleaseAssets,
})

