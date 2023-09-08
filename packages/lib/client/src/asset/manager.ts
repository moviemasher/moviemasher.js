import type { ClientAsset, ClientAssets, EventManagedAssetsDetail } from '@moviemasher/runtime-client'
import type { AssetObject, DataOrError, ManageType } from '@moviemasher/runtime-shared'

import { assertDefined, idIsTemporary, sortByRequestable } from '@moviemasher/lib-shared'
import { EventAsset, EventAssetObjects, EventChangedServerAction, EventImportManagedAssets, EventImportedManagedAssets, EventManagedAsset, EventManagedAssetIcon, EventManagedAssetId, EventManagedAssetScalar, EventManagedAssets, EventReleaseManagedAssets, EventSavableManagedAsset, EventSavableManagedAssets, MovieMasher, ServerActionSave, isClientAsset } from '@moviemasher/runtime-client'
import { arrayFromOneOrMore, assertAsset, isDefiniteError } from '@moviemasher/runtime-shared'
import { isClientMashAsset } from '../Client/Mash/ClientMashGuards.js'

export const ManageTypeFetch: ManageType = 'fetch'
export const ManageTypeImport: ManageType = 'import'
export const ManageTypeReference: ManageType = 'reference'

export class ClientAssetManagerClass {
  private assetArraysByType = new Map<ManageType, ClientAssets>()

  private assetsById = new Map<string, ClientAsset>()

  private asset(object: string | AssetObject, manageType = ManageTypeReference): ClientAsset | undefined {
    const event = new EventAsset(object)
    MovieMasher.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    if (!isClientAsset(asset)) return 
    
    this.install(asset, manageType)
    return asset 
  }

  private get assets(): ClientAssets {
    return Array.from(this.assetsById.values()) as ClientAssets
  }

  private _assetObjectsPromise?: Promise<void>

  private assetObjectsPromise(detail: EventManagedAssetsDetail): Promise<void> {
    return this._assetObjectsPromise ||= this.assetObjectsPromiseInitialize(detail)
  }
  
  private assetObjectsPromiseInitialize(detail: EventManagedAssetsDetail): Promise<void> {
    // console.debug(this.constructor.name, 'assetObjectsPromiseInitialize...')

    const event = new EventAssetObjects(detail)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return Promise.resolve()
    
    return promise.then(orError => {
      if (!isDefiniteError(orError)) {
        // console.debug(this.constructor.name, 'assetObjectsPromiseInitialize!')

        const { data: assetObjects } = orError
        assetObjects.forEach(assetObject => this.asset(assetObject, ManageTypeFetch))
      }
    })
  }

  private assetsPromise(detail: EventManagedAssetsDetail): Promise<DataOrError<ClientAssets>> {
    // console.debug(this.constructor.name, 'assetsPromise...')

    const { type } = detail
    return this.assetObjectsPromise(detail).then(() => {
      // console.debug(this.constructor.name, 'assetsPromise!')

      return { data: this.assets.filter(asset => asset.type === type) }
    })
  }

  private byType(type: ManageType): ClientAssets {
    const array = this.assetArraysByType.get(type) 
    if (array) return array

    const assets: ClientAssets = []
    this.assetArraysByType.set(type, assets)
    return assets
  }

  private fromId(id: string): ClientAsset | undefined {
    return this.assetsById.get(id)
  }

  private install(asset: ClientAsset | ClientAssets, manageType: ManageType): ClientAssets {
    const assets = arrayFromOneOrMore(asset) 
    return assets.map(asset => {
      const { id } = asset
      const existing = this.fromId(id)
      if (existing) return existing

      this.assetsById.set(id, asset)
      this.byType(manageType).push(asset)
      if (idIsTemporary(id)) {
        console.log(this.constructor.name, 'install', id)
        MovieMasher.eventDispatcher.dispatch(new EventChangedServerAction(ServerActionSave))
      }
      return asset
    })
  }

  private undefine(manageType?: ManageType) {
    const { assetArraysByType } = this
    const types = manageType ? [manageType] : [...assetArraysByType.keys()]

    types.forEach(type => { 
      if (!assetArraysByType.has(type)) return

      this.byType(type).forEach(asset => { this.uninstall(asset, type) })
    })
  }

  private uninstall(asset: ClientAsset, manageType: ManageType): boolean {
    const { id } = asset
    if (!this.assetsById.delete(id)) return false

    const assets = this.byType(manageType)
    const index = assets.indexOf(asset)
    if (index < 0) return false

    assets.splice(index, 1)
    return true
  }

  private updateDefinitionId(oldId: string, newId: string) {
    console.log(this.constructor.name, 'updateDefinitionId', oldId, '->', newId)
    const asset = this.assetsById.get(oldId)
    assertAsset(asset)

    this.assetsById.delete(oldId)
    this.assetsById.set(newId, asset)
    const mashAssets = Array.from(this.assetsById.values()).filter(isClientMashAsset)
    mashAssets.forEach(mashAsset => { mashAsset.updateAssetId(oldId, newId) })
  }

  static handleImportManagedAssets(event: EventImportManagedAssets) {
    const { instance } = ClientAssetManagerClass
    const { detail: objects } = event

    const orUndefines = objects.map(object => instance.asset(object, ManageTypeImport))
    const assets = orUndefines.filter(isClientAsset)
    if (assets.length) {
      MovieMasher.eventDispatcher.dispatch(new EventImportedManagedAssets(assets))
    }
  }

  static handleManagedAsset(event: EventManagedAsset) {
    const { instance } = ClientAssetManagerClass
    const { detail } = event
    const { assetObject, assetId, manageType } = detail
    const id = assetId || assetObject?.id
    assertDefined(id)

    detail.asset = instance.fromId(id)
    console.debug('ClientAssetManagerClass handleManagedAsset', id, !!detail.asset)
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
    // console.debug('ClientAssetManagerClass handleManagedAssets')
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
