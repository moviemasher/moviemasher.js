import type { Asset, AssetManager, AssetObject, AssetParams, Assets, ClientAsset, ClientAssets, ClientMashAsset, DataOrError, Identified, ListenersFunction, ManageType, ManageTypes, MashAsset, Strings } from '@moviemasher/shared-lib/types.js'
import type { EventManagedAssetsDetail } from '../utility/event-types.js'

import { AssetManagerClass } from '@moviemasher/shared-lib/base/asset-manager.js'
import { $CACHE_ALL, $CACHE_NONE, $CACHE_SOURCE_TYPE, $IMPORT, $RAW, $SAVE, DASH, ERROR, MOVIE_MASHER, arrayFromOneOrMore, arrayRemove, assertAsset, idIsTemporary, isAsset, isAssetObject, isDefiniteError, namedError } from '@moviemasher/shared-lib/runtime.js'
import { isPositive } from '@moviemasher/shared-lib/utility/guard.js'
import { assertDefined, isMashAsset } from '@moviemasher/shared-lib/utility/guards.js'
import { isClientMashAsset } from '../guards/ClientMashGuards.js'
import { EventAssetObjects, EventCanDestroy, EventChangedManagedAssets, EventChangedMashAsset, EventChangedServerAction, EventImportManagedAssets, EventManagedAsset, EventManagedAssetIcon, EventManagedAssetId, EventManagedAssetPromise, EventManagedAssets, EventSavableManagedAsset, EventSavableManagedAssets, EventWillDestroy } from '../module/event.js'
import { $REFERENCE } from '../utility/constants.js'
import { isClientAsset } from '@moviemasher/shared-lib/utility/client-guards.js'

interface RawAsset extends Asset {}

type AssetOrObject = Asset | AssetObject
type AssetOrObjects = AssetOrObject[]

const isRawAsset = (value: any): value is RawAsset => {
  return isAsset(value) && value.source === $RAW
}

const sortByContainedMash = (a: MashAsset, b: MashAsset): number => {
  const { assets: aAssets } = a
  const { assets: bAssets } = b
  const aFound = isPositive(bAssets.indexOf(a))
  const bFound = isPositive(aAssets.indexOf(b))
  if (aFound === bFound) return 0

  return aFound ? -1 : 1
}

const sortByMash = (a: Asset, b: Asset): number => {
  const aIsMash = isMashAsset(a)
  const bIsMash = isMashAsset(b)
  if (aIsMash === bIsMash) {
    return aIsMash && bIsMash ? sortByContainedMash(a, b) : 0
  }
  return bIsMash ? -1 : 1
}

const sortByRaw = (a: Asset, b: Asset): number => {
  const aIsRequestable = isRawAsset(a)
  const bIsRequestable = isRawAsset(b)
  if (aIsRequestable === bIsRequestable) {
    return aIsRequestable && bIsRequestable ? 0 : sortByMash(a, b) 
  }
  return aIsRequestable ? -1 : 1
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

export class ClientAssetManagerClass extends AssetManagerClass implements AssetManager {
  private asset(object: AssetObject): Asset | undefined {
    const asset = this.fromCall(object)
    if (!isClientAsset(asset)) return 

    return asset 
  }

  private managedAssetPromise = async (assetObject: AssetObject | Identified): Promise<DataOrError<Asset>>  => {
    const { id: assetId } = assetObject
    const data = this.fromId(assetId)
    if (data) return { data }
    
    if (!isAssetObject(assetObject)) {
      return namedError(ERROR.Unavailable, 'assetObject') 
    }
    const orError = await this.define(assetObject)
    if (isDefiniteError(orError)) return orError

    const { data: assets } = orError
    return { data: assets[0] }
  }

  private assetObjectsPromises = new Map<string, Promise<ClientAssets>>()

  private assetObjectsPromise(params: AssetParams, ignoreCache?: boolean): Promise<Assets> {
    const allCached = this.assetObjectsPromises.has($CACHE_ALL)
    const hasTerms = params.terms?.length
    const saveKey = !(hasTerms || ignoreCache)
    const canCache = allCached || !hasTerms
    const useCache = canCache && !ignoreCache 
    const key = allCached ? $CACHE_ALL : this.assetParamsKey(params)
    if (useCache) {
      const existing = this.assetObjectsPromises.get(key)
      if (existing) {
        // console.log('ClientAssetManagerClass.assetObjectsPromise existing', key)
        return existing
      }
    }
    const event = new EventAssetObjects(params)
    MOVIE_MASHER.dispatchCustom(event)
    const { promise } = event.detail
    // console.log('ClientAssetManagerClass.assetObjectsPromise', !!promise)
    if (!promise) return Promise.resolve([])

    const installPromise: Promise<ClientAssets> = promise.then(orError => {
      if (isDefiniteError(orError)) return []
      
      const { data } = orError
      const { assets: objects, cacheControl = $CACHE_ALL } = data
      // const events = this.installEvents(...objects.map(object => object.id))
      if (this.controlCache(cacheControl, installPromise) && saveKey) {
        // console.debug(this.constructor.name, 'assetObjectsPromise REMOVING cache', key)
        this.assetObjectsPromises.delete(key)
      }
      return this.define(...objects).then(orError => {
        if (isDefiniteError(orError)) return []
        const { data: assets } = orError
        return assets.filter(isClientAsset)
      })
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
    return [...this.assetsById.values()].filter(isClientAsset)
  }

  private assetFiltered(manageType: ManageType, asset: ClientAsset): boolean {
    switch (manageType) {
      case $REFERENCE: return this.mashAsset?.assetIds.includes(asset.id) ?? false
      case $IMPORT: return this.importingAssets.includes(asset)
    }
    return true
  }

  private assetsFiltered(params: AssetParams, filterTypes?: ManageTypes, sorts?: Strings): Assets {
    const types = arrayFromOneOrMore(params.types || [])
    const sources = arrayFromOneOrMore(params.sources || [])
    const terms = arrayFromOneOrMore(params.terms || [])
    const assets = this.assets.filter(asset => {
      if (types.length && !types.includes(asset.type)) return false
      if (sources.length && !sources.includes(asset.source)) return false
      if (terms.length) {

        const label = asset.string('label') 
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
          const valueA = String(a.value(key) || '')
          const valueB = String(b.value(key) || '')
          const result = valueA.localeCompare(valueB)
          if (result) return result * (order === 'asc' ? 1 : -1)
        }
        return 0
      })
    }
    return assets
  }

  private async assetsPromise(detail: EventManagedAssetsDetail): Promise<DataOrError<Assets>> {
    const { sorts, manageTypes, ignoreCache, promise, ...rest } = detail
    if (!manageTypes?.length) await this.assetObjectsPromise(rest, ignoreCache)
    return { data: this.assetsFiltered(rest, manageTypes, sorts) }
  }

  private controlCache(cacheControl: string, promise: Promise<ClientAssets>): boolean {
    switch (cacheControl) {
      case $CACHE_NONE: break
      case $CACHE_ALL: {
        // console.debug(this.constructor.name, 'assetObjectsPromise ADDING cache', $CACHE_ALL)
        this.assetObjectsPromises.set($CACHE_ALL, promise)
        break
      }
      case $CACHE_SOURCE_TYPE: return false
    }
    return true
  }
  
  private importingAssets: ClientAssets = []


  private installEvents(...ids: Strings): Event[] {
    const events: Event[] = []
    const uninstalled = ids.filter(id => !this.assetsById.has(id))
    if (uninstalled.length) {
      events.push(new EventChangedManagedAssets())
      console.log(this.constructor.name, 'installEvents', EventChangedManagedAssets.Type)

      if (uninstalled.some(id => idIsTemporary(id))) {
        console.log(this.constructor.name, 'installEvents', EventChangedServerAction.Type, $SAVE)
        events.push(new EventChangedServerAction($SAVE))
      }
    }
    return events
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

  override undefine(objectOrArray?: string | Strings): void {
    const ids = arrayFromOneOrMore(objectOrArray)
    const allCached = this.assetObjectsPromises.has($CACHE_ALL)
    if (allCached) {
      console.debug(this.constructor.name, 'undefine allCached', $CACHE_ALL) 
      return
    }
    const toRemove = ids || this.assets.map(asset => asset.id)
    if (ids) arrayRemove(toRemove, this.importingAssets.map(asset => asset.id))
    // console.log(this.constructor.name, 'undefine', toRemove.join(', '))
    const willEvent = new EventWillDestroy(toRemove)
    MOVIE_MASHER.dispatchCustom(willEvent)
    // console.log(this.constructor.name, 'undefine', toRemove.join(', '))
    toRemove.forEach(id => {
      const asset = this.assetsById.get(id)
      if (!asset) {
        console.warn(this.constructor.name, 'undefine', id, 'not found')
        return
      }
      // console.log(this.constructor.name, 'undefining', asset.type, asset.label, asset.id)
      if (isClientAsset(asset)) asset.unload()
      this.assetsById.delete(asset.id)
    })
  }

  override updateDefinitionId(oldId: string, newId: string) {
    console.log(this.constructor.name, 'updateDefinitionId', oldId, '->', newId)
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
    if (idIsTemporary(oldId)) {
      MOVIE_MASHER.dispatchCustom(new EventChangedServerAction($SAVE))
    }
  }

  static handleCanDestroy(event: EventCanDestroy) {
    event.stopImmediatePropagation()
    ClientAssetManagerClass.instance.undefine(event.detail)
  }

  static handleChangedMashAsset(event: EventChangedMashAsset) {
    // console.log('ClientAssetManagerClass.handleChangedMashAsset', !!event.detail)
    ClientAssetManagerClass.instance.mashAsset = event.detail
  }

  static handleImportManagedAssets(event: EventImportManagedAssets) {
    const { instance } = ClientAssetManagerClass
    const { detail: objects } = event
    const events = instance.installEvents(...objects.map(object => object.id))  
    console.log('ClientAssetManagerClass.handleImportManagedAssets', events.length, objects.length)
    const orUndefines = objects.map(object => instance.fromCall(object))
    const assets = orUndefines.filter(isClientAsset)
    if (assets.length) {
      instance.importingAssets.push(...assets)
    }
    events.forEach(event => {
      console.log('ClientAssetManagerClass.handleImportManagedAssets', event.type)
      MOVIE_MASHER.dispatchCustom(event)
  })
  }

  static handleManagedAsset(event: EventManagedAsset) {
    const { instance } = ClientAssetManagerClass
    const { detail } = event
    const { assetObject, assetId } = detail
    const id = assetId || assetObject?.id
    assertDefined(id)

    const asset = instance.fromId(id)
    if (isClientAsset(asset)) detail.asset = asset
    if (!detail.asset) {
      // console.log('ClientAssetManagerClass.handleManagedAsset', id, 'not defined')
      const idOrObject = assetObject || assetId 
      assertDefined(idOrObject)

      const instanceAsset = instance.asset(idOrObject)
      if (isClientAsset(instanceAsset)) detail.asset = instanceAsset
    }
    event.stopImmediatePropagation()
  }

  static handleManagedAssetPromise (event: EventManagedAssetPromise) {
    const { instance } = ClientAssetManagerClass
    const { detail } = event
    const { assetId: id } = detail
    const { assetObject = { id } } = detail
    detail.promise = instance.managedAssetPromise(assetObject)
    event.stopImmediatePropagation()
  }

  static handleManagedAssetIcon(event: EventManagedAssetIcon) {
    const { detail } = event
    const { assetId, size, cover } = detail
    const { instance } = ClientAssetManagerClass
    const asset = instance.fromId(assetId)
    if (asset) {
      // console.log('ClientAssetManagerClass.handleManagedAssetIcon', asset.label)
      if (isClientAsset(asset)) detail.promise = asset.assetIcon(size, cover) 
      event.stopImmediatePropagation()
    }
  }
  
  static handleManagedAssetId(event: EventManagedAssetId) {
    console.log('ClientAssetManagerClass.handleManagedAssetId')
    const { instance } = ClientAssetManagerClass
    const { previousId, currentId } = event.detail
    instance.updateDefinitionId(previousId, currentId)

    event.stopImmediatePropagation()
    if (idIsTemporary(previousId)) {
      MOVIE_MASHER.dispatchCustom(new EventChangedServerAction($SAVE))
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
    const savable = needed || instance.assets.some(asset => asset.saveNeeded)
    console.log('ClientAssetManagerClass.handleSavableManagedAsset', needed, savable, !!instance.mashAsset)
    event.detail.savable = savable
  }

  static handleSavableManagedAssets(event: EventSavableManagedAssets) {
    event.stopImmediatePropagation()
    const { assets: allAssets } = ClientAssetManagerClass.instance
    const savableAssets = allAssets.filter(asset => asset.saveNeeded)
    const sortedAssets = savableAssets.sort(sortByRaw)
    event.detail.assets.push(...sortedAssets)
    console.log('ClientAssetManagerClass.handleSavableManagedAssets', sortedAssets.map(asset => asset.value('label')))
  }

  static handleUnload() { ClientAssetManagerClass.instance.undefine() }

  private static instance = new ClientAssetManagerClass()
}

export const ClientAssetManagerListeners: ListenersFunction = () => ({
  [EventManagedAssetPromise.Type]: ClientAssetManagerClass.handleManagedAssetPromise,
  [EventManagedAsset.Type]: ClientAssetManagerClass.handleManagedAsset,

  [EventChangedMashAsset.Type]: ClientAssetManagerClass.handleChangedMashAsset,
  [EventImportManagedAssets.Type]: ClientAssetManagerClass.handleImportManagedAssets,
  [EventManagedAssetIcon.Type]: ClientAssetManagerClass.handleManagedAssetIcon,
  [EventManagedAssetId.Type]: ClientAssetManagerClass.handleManagedAssetId,
  [EventManagedAssets.Type]: ClientAssetManagerClass.handleManagedAssets,
  [EventSavableManagedAsset.Type]: ClientAssetManagerClass.handleSavableManagedAsset,
  [EventSavableManagedAssets.Type]: ClientAssetManagerClass.handleSavableManagedAssets,
  [EventCanDestroy.Type]: ClientAssetManagerClass.handleCanDestroy,
})

globalThis.window.addEventListener('unload', ClientAssetManagerClass.handleUnload, { once: true })