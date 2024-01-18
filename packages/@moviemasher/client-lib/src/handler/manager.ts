import type { ClientAsset, ClientAssets, ClientMashAsset } from '../types.js'
import type { Asset, AssetObject, AssetObjects, AssetParams, DataOrError, Identified, ListenersFunction, ManageType, ManageTypes, Strings } from '@moviemasher/shared-lib/types.js'

import { assertDefined, isPositive, isRequestable } from '@moviemasher/shared-lib/utility/guards.js'
import { IMPORT, REFERENCE, SAVE, isClientAsset } from '../runtime.js'
import { EventCanDestroy, EventAsset, EventAssetObjects, EventChangedManagedAssets, EventChangedMashAsset, EventChangedServerAction, EventImportManagedAssets, EventManagedAssetPromise, EventManagedAsset, EventManagedAssetIcon, EventManagedAssetId, EventManagedAssets, EventSavableManagedAsset, EventSavableManagedAssets, EventWillDestroy } from '../utility/events.js'
import { EventManagedAssetsDetail } from '../types.js'
import { MOVIEMASHER, CACHE_ALL, CACHE_NONE, CACHE_SOURCE_TYPE, DASH, arrayFromOneOrMore, arrayRemove, assertAsset, idIsTemporary, isDefiniteError, ERROR, isAssetObject, namedError } from '@moviemasher/shared-lib/runtime.js'
import { isClientMashAsset } from '../guards/ClientMashGuards.js'

const sortByContainedMash = (a: ClientMashAsset, b: ClientMashAsset): number => {
  const { assets: aAssets } = a
  const { assets: bAssets } = b
  const aFound = isPositive(bAssets.indexOf(a))
  const bFound = isPositive(aAssets.indexOf(b))
  if (aFound === bFound) return 0

  return aFound ? -1 : 1
}

const sortByMash = (a: ClientAsset, b: ClientAsset): number => {
  const aIsMash = isClientMashAsset(a)
  const bIsMash = isClientMashAsset(b)
  if (aIsMash === bIsMash) {
    return aIsMash && bIsMash ? sortByContainedMash(a, b) : 0
  }
  return bIsMash ? -1 : 1
}

const sortByRequestable = (a: ClientAsset, b: ClientAsset): number => {
  const aIsRequestable = isRequestable(a)
  const bIsRequestable = isRequestable(b)
  if (aIsRequestable === bIsRequestable) {
    return aIsRequestable && bIsRequestable ? 0 : sortByMash(a, b) 
  }
  return aIsRequestable ? -1 : 1
}

export class ClientAssetManagerClass {
  private assetsById = new Map<string, ClientAsset>()

  private asset(object: string | AssetObject): ClientAsset | undefined {
    const asset = this.assetFromObject(object)
    if (!isClientAsset(asset)) return 

    this.install(asset)
    return asset 
  }

  private managedAssetsPromise = async (assetObject: AssetObject | Identified): Promise<DataOrError<ClientAsset>>  => {
    const { id: assetId } = assetObject
    const data = this.fromId(assetId)
    if (data) return { data }
    
    if (!isAssetObject(assetObject)) {
      return namedError(ERROR.Unavailable, 'assetObject') 
    }
    const { assets } = assetObject
    const nested = nestedAssets(assets)
    for (const object of nested) {
      const assetOrError = await this.assetPromise(object)
      if (isDefiniteError(assetOrError)) return assetOrError
    }
    const result = await this.assetPromise(assetObject)
    return result
  }

  private assetPromise = async (assetObject: AssetObject | Identified): Promise<DataOrError<ClientAsset>> => {
    const { id: assetId } = assetObject
    const data = this.fromId(assetId)
    if (data) return { data }
    
    if (!isAssetObject(assetObject)) {
      return namedError(ERROR.Unavailable, 'assetObject') 
    } 
    
    // TODO: support loading of module...
    const asset = this.asset(assetObject)
    if (!asset) return namedError(ERROR.Unavailable, 'asset')
    return { data: asset }
  }


  private assetFromObject(object: string | AssetObject): ClientAsset | undefined {
    const event = new EventAsset(object)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    return event.detail.asset
  }

  private assetObjectsPromises = new Map<string, Promise<ClientAssets>>()

  private assetObjectsPromise(params: AssetParams, ignoreCache?: boolean): Promise<ClientAssets> {

    // console.log('ClientAssetManagerClass.assetObjectsPromise', ignoreCache, params)

    const allCached = this.assetObjectsPromises.has(CACHE_ALL)
    const hasTerms = params.terms?.length
    const saveKey = !(hasTerms || ignoreCache)
    const canCache = allCached || !hasTerms
    const useCache = canCache && !ignoreCache 
    const key = allCached ? CACHE_ALL : this.assetParamsKey(params)
    if (useCache) {
      const existing = this.assetObjectsPromises.get(key)
      if (existing) {
        // console.log('ClientAssetManagerClass.assetObjectsPromise existing', key)
        return existing
      }
    }
    const event = new EventAssetObjects(params)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    // console.log('ClientAssetManagerClass.assetObjectsPromise', !!promise)
    if (!promise) return Promise.resolve([])

    const installPromise: Promise<ClientAssets> = promise.then(orError => {
      if (isDefiniteError(orError)) {
        // console.error(this.constructor.name, 'assetObjectsPromise', orError, key, params)
        return []
      }
      const { data } = orError
      const { assets: assetObjects, cacheControl = CACHE_ALL } = data

      if (this.controlCache(cacheControl, installPromise) && saveKey) {
        // console.debug(this.constructor.name, 'assetObjectsPromise REMOVING cache', key)
        this.assetObjectsPromises.delete(key)
      }
    
      const orUndefines = assetObjects.map(assetObject => this.assetFromObject(assetObject))
      return orUndefines.filter(isClientAsset)
    })         
    if (saveKey) {
      // console.debug(this.constructor.name, 'assetObjectsPromise ADDING cache', key)
      this.assetObjectsPromises.set(key, installPromise)
    }
    return installPromise
  }

  private assetParamsKey(params: AssetParams): string {
    const types = arrayFromOneOrMore(params.types || [])
    const sources = arrayFromOneOrMore(params.sources || [])
    return [...types, ...sources].sort().join(DASH)
  }

  private get assets(): ClientAssets {
    return [...this.assetsById.values()] 
  }

  private assetFiltered(manageType: ManageType, asset: ClientAsset): boolean {
    switch (manageType) {
      case REFERENCE: return this.mashAsset?.assetIds.includes(asset.id) ?? false
      case IMPORT: return this.importingAssets.includes(asset)
    }
    return true
  }

  private assetsFiltered(params: AssetParams, filterTypes?: ManageTypes, sorts?: Strings): ClientAssets {
    const types = arrayFromOneOrMore(params.types || [])
    const sources = arrayFromOneOrMore(params.sources || [])
    const terms = arrayFromOneOrMore(params.terms || [])
    const assets = this.assets.filter(asset => {
      if (types.length && !types.includes(asset.type)) return false
      if (sources.length && !sources.includes(asset.source)) return false
      if (terms.length) {
        const { label = '' } = asset
        if (!terms.some(term => label.includes(term))) return false
      }

      if (filterTypes?.length) {
        return filterTypes.some(manageType => this.assetFiltered(manageType, asset))
      }
      return true
    }) 
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
    
    // this.viewingAssets = assets
    // this.undefine()
    return assets
  }

  private async assetsPromise(detail: EventManagedAssetsDetail): Promise<DataOrError<ClientAssets>> {
    const { sorts, manageTypes, ignoreCache, promise, ...rest } = detail
    if (!manageTypes?.length) {
      const assets = await this.assetObjectsPromise(rest, ignoreCache)
      this.install(assets) 
    }
    return { data: this.assetsFiltered(rest, manageTypes, sorts) }
  }

  private controlCache(cacheControl: string, promise: Promise<ClientAssets>): boolean {
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

  // private viewingAssets: ClientAssets = []
  
  private importingAssets: ClientAssets = []


  private fromId(id: string): ClientAsset | undefined {
    return this.assetsById.get(id)
  }

  private install(asset: ClientAsset | ClientAssets): ClientAssets {
    const assets = arrayFromOneOrMore(asset) 
    const uninstalled = assets.filter(asset => !this.assetsById.has(asset.id))
    if (uninstalled.length) {
      uninstalled.forEach(asset => {
        // console.log(this.constructor.name, 'defining', asset.type, asset.label, asset.id)
        this.assetsById.set(asset.id, asset)
      })
      MOVIEMASHER.eventDispatcher.dispatch(new EventChangedManagedAssets())
      if (assets.some(asset => idIsTemporary(asset.id))) {
        MOVIEMASHER.eventDispatcher.dispatch(new EventChangedServerAction(SAVE))
      }
    }
    return assets
  }

  private _mashAsset?: ClientMashAsset
  get mashAsset(): ClientMashAsset | undefined { return this._mashAsset }
  set mashAsset(value: ClientMashAsset | undefined) {
    const { _mashAsset } = this
    if (value !== _mashAsset) {
      if (value) this.assetsById.set(value.id, value)
      this._mashAsset = value
      if (_mashAsset) this.undefine([_mashAsset.id, ..._mashAsset.assetIds])
    }
  }

  private undefine(ids?: Strings): void {
    const allCached = this.assetObjectsPromises.has(CACHE_ALL)
    if (allCached) {
      console.debug(this.constructor.name, 'undefine allCached', CACHE_ALL) 
      return
    }
    const toRemove = ids || this.assets.map(asset => asset.id)
    if (ids) arrayRemove(toRemove, this.importingAssets.map(asset => asset.id))
    // console.log(this.constructor.name, 'undefine', toRemove.join(', '))
    const willEvent = new EventWillDestroy(toRemove)
    MOVIEMASHER.eventDispatcher.dispatch(willEvent)
    // console.log(this.constructor.name, 'undefine', toRemove.join(', '))
    toRemove.forEach(id => {
      const asset = this.assetsById.get(id)
      if (!asset) {
        console.warn(this.constructor.name, 'undefine', id, 'not found')
        return
      }
      // console.log(this.constructor.name, 'undefining', asset.type, asset.label, asset.id)
      asset.unload()
      this.assetsById.delete(asset.id)
    })
  }

  private updateDefinitionId(oldId: string, newId: string) {
    // console.log(this.constructor.name, 'updateDefinitionId', oldId, '->', newId)
    const clientAsset = this.assetsById.get(oldId)
    assertAsset(clientAsset)

    this.assetsById.delete(oldId)
    this.assetsById.set(newId, clientAsset)

    arrayRemove(this.importingAssets, clientAsset)

    // remove cached assetObjectsPromises
    const { source, type } = clientAsset
    const keys = [
      this.assetParamsKey({ types: [type] }),
      this.assetParamsKey({ sources: [source] }),
      this.assetParamsKey({ types: [type], sources: [source] })
    ]
    keys.forEach(key => this.assetObjectsPromises.delete(key))

    const mashAssets = this.assets.filter(isClientMashAsset)
    mashAssets.forEach(mashAsset => { mashAsset.updateAssetId(oldId, newId) })
  }

  static handleCanDestroy(event: EventCanDestroy) {
    event.stopImmediatePropagation()
    ClientAssetManagerClass.instance.undefine(event.detail)
  }

  static handleChangedMashAsset(event: EventChangedMashAsset) {
    ClientAssetManagerClass.instance.mashAsset = event.detail
  }

  static handleImportManagedAssets(event: EventImportManagedAssets) {
    const { instance } = ClientAssetManagerClass
    const { detail: objects } = event

    const orUndefines = objects.map(object => instance.assetFromObject(object))
    const assets = orUndefines.filter(isClientAsset)
    if (assets.length) {
      instance.install(assets)
      instance.importingAssets.push(...assets)
    }
  }

  static handleManagedAsset(event: EventManagedAsset) {
    const { instance } = ClientAssetManagerClass
    const { detail } = event
    const { assetObject, assetId } = detail
    const id = assetId || assetObject?.id
    assertDefined(id)

    detail.asset = instance.fromId(id)
    if (!detail.asset) {
      // console.log('ClientAssetManagerClass.handleManagedAsset', id, 'not defined')
      const idOrObject = assetObject || assetId 
      assertDefined(idOrObject)

      detail.asset = instance.asset(idOrObject)
    }
    event.stopImmediatePropagation()
  }

  static handleManagedAssetPromise (event: EventManagedAssetPromise) {
    const { instance } = ClientAssetManagerClass
    const { detail } = event
    const { assetId: id } = detail
    const { assetObject = { id } } = detail
    detail.promise = instance.managedAssetsPromise(assetObject)
    event.stopImmediatePropagation()
  }

  static handleManagedAssetIcon(event: EventManagedAssetIcon) {
    const { detail } = event
    const { assetId, size, cover } = detail
    const { instance } = ClientAssetManagerClass
    const asset = instance.fromId(assetId)
    if (asset) {
      // console.log('ClientAssetManagerClass.handleManagedAssetIcon', asset.label)
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
      MOVIEMASHER.eventDispatcher.dispatch(new EventChangedServerAction(SAVE))
    }
  }

  static handleManagedAssets(event: EventManagedAssets) {
    event.stopImmediatePropagation()
    const { detail } = event
    const { instance } = ClientAssetManagerClass
    detail.promise = instance.assetsPromise(detail)
  }

  static handleSavableManagedAsset(event: EventSavableManagedAsset) {
    event.stopImmediatePropagation()
    const { instance } = ClientAssetManagerClass
    const needed = instance.mashAsset?.saveNeeded
    event.detail.savable = needed || instance.assets.some(asset => asset.saveNeeded)
  }

  static handleSavableManagedAssets(event: EventSavableManagedAssets) {
    event.stopImmediatePropagation()
    const { assets: allAssets } = ClientAssetManagerClass.instance
    const savableAssets = allAssets.filter(asset => asset.saveNeeded)
    const sortedAssets = savableAssets.sort(sortByRequestable)
    event.detail.assets.push(...sortedAssets)
  }

  static handleUnload() { ClientAssetManagerClass.instance.undefine() }

  private static instance = new ClientAssetManagerClass()
}

type AssetOrObject = Asset | AssetObject
type AssetOrObjects = AssetOrObject[]

const nestedAssets = (assets?: AssetObjects): AssetObjects => {
  if (!assets?.length) return []

  const nested = assets.flatMap(asset => {
    const { assets } = asset
    if (!assets) return [] as AssetOrObjects

    return assets
  }) 
  return [ ...nestedAssets(nested), ...assets,]
}


const assetsIncludeAsset = (assets: AssetOrObjects, asset: Asset): boolean => {
  if (!assets.length) return false

  const { id } = asset
  if (assets.some(asset => asset.id === id)) return true

  const subs = assets.flatMap(asset => {
    const { assets } = asset
    if (!assets) return [] as AssetOrObjects

    return assets
  }) 
  return assetsIncludeAsset(subs, asset)
}

export const ClientAssetManagerListeners: ListenersFunction = () => ({
  [EventChangedMashAsset.Type]: ClientAssetManagerClass.handleChangedMashAsset,
  [EventImportManagedAssets.Type]: ClientAssetManagerClass.handleImportManagedAssets,
  [EventManagedAsset.Type]: ClientAssetManagerClass.handleManagedAsset,
  [EventManagedAssetPromise.Type]: ClientAssetManagerClass.handleManagedAssetPromise,
  [EventManagedAssetIcon.Type]: ClientAssetManagerClass.handleManagedAssetIcon,
  [EventManagedAssetId.Type]: ClientAssetManagerClass.handleManagedAssetId,
  [EventManagedAssets.Type]: ClientAssetManagerClass.handleManagedAssets,
  [EventSavableManagedAsset.Type]: ClientAssetManagerClass.handleSavableManagedAsset,
  [EventSavableManagedAssets.Type]: ClientAssetManagerClass.handleSavableManagedAssets,
  [EventCanDestroy.Type]: ClientAssetManagerClass.handleCanDestroy,
})

globalThis.window.addEventListener('unload', ClientAssetManagerClass.handleUnload, { once: true })