import type { ClientAsset, ClientAssets, EventManagedAssetsDetail } from '@moviemasher/runtime-client'
import type { AssetObject, AssetParams, DataOrError, ManageType, ManageTypes, Strings } from '@moviemasher/runtime-shared'

import { DASH, arrayFromOneOrMore, assertDefined, idIsTemporary, sortByRequestable, CACHE_ALL, CACHE_NONE, CACHE_SOURCE_TYPE } from '@moviemasher/lib-shared'
import { EventAsset, EventAssetObjects, REFERENCE, EventChangedServerAction, EventImportManagedAssets, EventChangedManagedAssets, EventManagedAsset, EventManagedAssetIcon, EventManagedAssetId, EventManagedAssetScalar, EventManagedAssets, EventReleaseManagedAssets, EventSavableManagedAsset, EventSavableManagedAssets, MovieMasher, ServerActionSave, isClientAsset, FETCH, IMPORT } from '@moviemasher/runtime-client'
import { assertAsset, isDefiniteError } from '@moviemasher/runtime-shared'
import { isClientMashAsset } from '../Client/Mash/ClientMashGuards.js'

export interface ManagedAsset {
  asset: ClientAsset
  manageTypes: ManageTypes
}

export interface ManagedAssets extends Array<ManagedAsset>{}

export class ClientAssetManagerClass {
  private assetsById = new Map<string, ManagedAsset>()

  private asset(object: string | AssetObject, manageType = REFERENCE): ClientAsset | undefined {
    const asset = this.assetFromObject(object)
    if (!isClientAsset(asset)) return 

    this.install(asset, manageType)
    return asset 
  }

  private assetFromObject(object: string | AssetObject): ClientAsset | undefined {
    const event = new EventAsset(object)
    MovieMasher.eventDispatcher.dispatch(event)
    return event.detail.asset
  }

  private get assets(): ClientAssets {
    return this.managedAssets.map(({ asset }) => asset)
  }

  private assetObjectsPromises = new Map<string, Promise<void>>()

  private assetObjectsPromise(params: AssetParams, ignoreCache?: boolean): Promise<void> {
    const allCached = this.assetObjectsPromises.has(CACHE_ALL)
    const hasTerms = params.terms?.length
    const saveKey = !(hasTerms || ignoreCache)
    const canCache = allCached || !hasTerms
    const useCache = canCache && !ignoreCache 

    const key = allCached ? CACHE_ALL : this.assetParamsKey(params)
    
    if (useCache) {
      const existing = this.assetObjectsPromises.get(key)
      if (existing) {
        // console.debug(this.constructor.name, 'assetObjectsPromise RETURNING cache', key)
        return existing
      }
    }
    
    const event = new EventAssetObjects(params)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return Promise.resolve()
    
    
    // console.debug(this.constructor.name, 'assetObjectsPromise', params)

    const installPromise: Promise<void> = promise.then(orError => {
      if (isDefiniteError(orError)) {
        // console.error(this.constructor.name, 'assetObjectsPromise', orError, key, params)
        return
      }
      const { data } = orError
      const { assets: assetObjects, cacheControl = CACHE_ALL } = data

      if (this.controlCache(cacheControl, installPromise) && saveKey) {
        // console.debug(this.constructor.name, 'assetObjectsPromise REMOVING cache', key)
        this.assetObjectsPromises.delete(key)
      }
    
      const orUndefines = assetObjects.map(assetObject => this.assetFromObject(assetObject))
      const assets = orUndefines.filter(isClientAsset)
      if (assets.length) this.install(assets, FETCH)
    })         
    if (saveKey) {
      // console.debug(this.constructor.name, 'assetObjectsPromise ADDING cache', key)
      this.assetObjectsPromises.set(key, installPromise)
    }
    return installPromise
  }

  private controlCache(cacheControl: string, promise: Promise<void>): boolean {
    switch (cacheControl) {
      case CACHE_NONE: break
      case CACHE_ALL: {
        // console.debug(this.constructor.name, 'assetObjectsPromise ADDING cache', CACHE_ALL)
        this.assetObjectsPromises.set(CACHE_ALL, promise)
        break
      }
      case CACHE_SOURCE_TYPE: return false
    }
    return true
  }

  private assetParamsKey(params: AssetParams): string {
    const types = arrayFromOneOrMore(params.types || [])
    const sources = arrayFromOneOrMore(params.sources || [])
    return [...types, ...sources].sort().join(DASH)
  }

  private assetsFiltered(params: AssetParams, manageTypes?: ManageTypes, sorts?: Strings): ClientAssets {
    const types = arrayFromOneOrMore(params.types || [])
    const sources = arrayFromOneOrMore(params.sources || [])
    const terms = arrayFromOneOrMore(params.terms || [])
    const { managedAssets } = this

    const filtered = managedAssets.filter(managedAsset => {
      const { asset, manageTypes: managedTypes } = managedAsset
      if (types.length && !types.includes(asset.type)) return false
      if (sources.length && !sources.includes(asset.source)) return false
      if (terms.length) {
        const { label = '' } = asset
        if (!terms.some(term => label.includes(term))) return false
      }

      if (manageTypes?.length) {
        return manageTypes.some(manageType => managedTypes.includes(manageType))
      }
      return true
    })
    // console.debug(this.constructor.name, 'assetsPromise', filtered.length, 'out of', managedAssets.length, 'assets')
    const assets = filtered.map(({ asset }) => asset)

    if (sorts?.length) {
      assets.sort((a, b) => {
        for (const sort of sorts) {
          const [key, order = 'asc'] = sort.split(DASH)
          const valueA = String(a.value(key))
          const valueB = String(b.value(key))
          const result = valueA.localeCompare(valueB)
          if (result) return result * (order === 'asc' ? 1 : -1)
        }
        return 0
      })
    }
    return assets
  }

  private async assetsPromise(detail: EventManagedAssetsDetail): Promise<DataOrError<ClientAssets>> {
    const { sorts, manageTypes, ignoreCache, promise, ...rest } = detail
    if (!manageTypes?.length || manageTypes.includes(FETCH)) {
      await this.assetObjectsPromise(rest, ignoreCache)
    }
    return { data: this.assetsFiltered(rest, manageTypes, sorts) }
  }

  private fromId(id: string): ClientAsset | undefined {
    return this.assetsById.get(id)?.asset
  }

  private install(asset: ClientAsset | ClientAssets, manageType: ManageType): ClientAssets {
    const assets = arrayFromOneOrMore(asset) 
    const uninstalled = assets.filter(asset => !this.assetsById.has(asset.id))
    if (uninstalled.length) {
      const temporary = uninstalled.filter(asset => {
        const { id } = asset
        this.assetsById.set(id, { manageTypes: [manageType], asset })
        return idIsTemporary(id)
      })
      MovieMasher.eventDispatcher.dispatch(new EventChangedManagedAssets())
      if (temporary.length) {
        MovieMasher.eventDispatcher.dispatch(new EventChangedServerAction(ServerActionSave))
      }
    }
    return assets
  }

  private get managedAssets(): ManagedAssets {
    return Array.from(this.assetsById.values()) as ManagedAssets
  }

  private undefine(type?: ManageType) {
    const { managedAssets: managed } = this
    const filtered = type ? managed.filter(({ manageTypes: types }) => types.includes(type)) : managed
    filtered.forEach(({ asset }) => this.assetsById.delete(asset.id))
  }

  private updateDefinitionId(oldId: string, newId: string) {
    // console.log(this.constructor.name, 'updateDefinitionId', oldId, '->', newId)
    const managedAsset = this.assetsById.get(oldId)
    assertAsset(managedAsset?.asset)

    this.assetsById.delete(oldId)
    this.assetsById.set(newId, managedAsset)
    const { manageTypes } = managedAsset
    managedAsset.manageTypes = manageTypes.filter(manageType => manageType !== IMPORT)

    const mashAssets = this.assets.filter(isClientMashAsset)
    mashAssets.forEach(mashAsset => { mashAsset.updateAssetId(oldId, newId) })
  }

  static handleImportManagedAssets(event: EventImportManagedAssets) {
    const { instance } = ClientAssetManagerClass
    const { detail: objects } = event

    const orUndefines = objects.map(object => instance.assetFromObject(object))
    const assets = orUndefines.filter(isClientAsset)
    if (assets.length) {
      instance.install(assets, IMPORT)

    }
  }

  static handleManagedAsset(event: EventManagedAsset) {
    const { instance } = ClientAssetManagerClass
    const { detail } = event
    const { assetObject, assetId, manageType } = detail
    const id = assetId || assetObject?.id
    assertDefined(id)

    detail.asset = instance.fromId(id)
    if (!detail.asset) {
      const idOrObject = assetObject || assetId 
      assertDefined(idOrObject)

      detail.asset = instance.asset(idOrObject, manageType)
    }
    event.stopImmediatePropagation()
  }

  static handleManagedAssetIcon(event: EventManagedAssetIcon) {
    const { detail } = event
    const { assetId, size, cover } = detail
    const { instance } = ClientAssetManagerClass
    const asset = instance.fromId(assetId)
    if (asset) {
      detail.promise = asset.assetIcon(size, cover) 
      event.stopImmediatePropagation()
    }
  }
  
  static handleManagedAssetId(event: EventManagedAssetId) {
    const { instance } = ClientAssetManagerClass
    const { previousId, currentId } = event.detail
    instance.updateDefinitionId(previousId, currentId)

    event.stopImmediatePropagation()
    if (idIsTemporary(previousId)) {
      MovieMasher.eventDispatcher.dispatch(new EventChangedServerAction(ServerActionSave))
    }
  }

  static handleManagedAssetScalar(event: EventManagedAssetScalar) {
    const { detail } = event
    const { assetId, propertyName } = detail
    const { instance } = ClientAssetManagerClass
    const asset = instance.fromId(assetId)
    if (asset) {
      detail.scalar = asset.value(propertyName)
      event.stopImmediatePropagation()
    }  
  }

  static handleManagedAssets(event: EventManagedAssets) {
    event.stopImmediatePropagation()
    const { detail } = event
    const { instance } = ClientAssetManagerClass
    detail.promise = instance.assetsPromise(detail)
  }

  static handleReleaseAssets(event: EventReleaseManagedAssets) {
    const { instance } = ClientAssetManagerClass
    const { detail: manageType } = event
    instance.undefine(manageType)
    event.stopImmediatePropagation()
  }

  static handleSavableManagedAsset(event: EventSavableManagedAsset) {
    event.stopImmediatePropagation()
    const { assets } = ClientAssetManagerClass.instance
    event.detail.savable = assets.some(asset => asset.saveNeeded)
  }

  static handleSavableManagedAssets(event: EventSavableManagedAssets) {
    event.stopImmediatePropagation()
    const { assets: allAssets } = ClientAssetManagerClass.instance
    const savableAssets = allAssets.filter(asset => asset.saveNeeded)
    const sortedAssets = savableAssets.sort(sortByRequestable)
    event.detail.assets.push(...sortedAssets)
  }

  private static instance = new ClientAssetManagerClass()
}

export const ClientAssetManagerListeners = () => ({
  [EventImportManagedAssets.Type]: ClientAssetManagerClass.handleImportManagedAssets,
  [EventManagedAsset.Type]: ClientAssetManagerClass.handleManagedAsset,
  [EventManagedAssetIcon.Type]: ClientAssetManagerClass.handleManagedAssetIcon,
  [EventManagedAssetId.Type]: ClientAssetManagerClass.handleManagedAssetId,
  [EventManagedAssets.Type]: ClientAssetManagerClass.handleManagedAssets,
  [EventManagedAssetScalar.Type]: ClientAssetManagerClass.handleManagedAssetScalar,
  [EventReleaseManagedAssets.Type]: ClientAssetManagerClass.handleReleaseAssets,
  [EventSavableManagedAsset.Type]: ClientAssetManagerClass.handleSavableManagedAsset,
  [EventSavableManagedAssets.Type]: ClientAssetManagerClass.handleSavableManagedAssets,
})
