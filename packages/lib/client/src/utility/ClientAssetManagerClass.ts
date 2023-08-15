import type { ClientAsset, ClientAssetManager, ClientAssets } from '@moviemasher/runtime-client'
import type { AssetObject, AssetType, ManageType } from '@moviemasher/runtime-shared'

import { idIsTemporary } from '@moviemasher/lib-shared'
import { ClientActionSave, EventAction, EventActionEnabled, EventAsset, EventChangedActionEnabled, EventManagedAsset, EventManagedAssetIcon, EventManagedAssetId, EventManagedAssetScalar, EventReleaseManagedAssets, MovieMasher, isClientAsset } from '@moviemasher/runtime-client'
import { AssetManagerClass, assertAsset, isDefiniteError } from '@moviemasher/runtime-shared'
import { isClientMashAsset } from '../Client/Mash/ClientMashGuards.js'

export class ClientAssetManagerClass extends AssetManagerClass implements ClientAssetManager {
  protected override asset(object: AssetObject): ClientAsset {
    const event = new EventAsset(object)
    MovieMasher.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    if (isClientAsset(asset)) this.install(asset)
    return asset as ClientAsset
  }

  private get assets(): ClientAssets {
    return Array.from(this.installedAssetsById.values()) as ClientAssets
  }

  protected override byType(type: AssetType): ClientAssets {
    return super.byType(type) as ClientAssets
  }

  protected override context = 'client'

  override define(media: string | AssetObject, manageType?: ManageType): ClientAsset {
    return super.define(media, manageType) as ClientAsset
  }

  override fromId(id: string): ClientAsset {
    return super.fromId(id) as ClientAsset
  }

  override install(media: ClientAsset | ClientAssets): ClientAssets {
    return super.install(media) as ClientAssets
  }

  updateDefinitionId(oldId: string, newId: string) {
    // console.log(this.constructor.name, 'updateDefinitionId', oldId, '->', newId)
    const asset = this.installedAssetsById.get(oldId)
    assertAsset(asset)

    this.installedAssetsById.delete(oldId)
    this.installedAssetsById.set(newId, asset)

    const mashAssets = Array.from(this.installedAssetsById.values()).filter(isClientMashAsset)
    mashAssets.forEach(mashAsset => {
      mashAsset.updateAssetId(oldId, newId)
    })
  }

  static handleActionEnabled(event: EventActionEnabled) {
    const { detail } = event
    const { clientAction } = detail
    if (clientAction === ClientActionSave) {
      const { assets } = ClientAssetManagerClass.instance
      if (assets.some(asset => asset.saveNeeded)) {
        console.debug('ClientAssetManagerClass handleActionEnabled TRUE', clientAction)
        detail.enabled = !this.saving
        event.stopImmediatePropagation()
      }
    }
  }
  static handleAction(event: EventAction) {
    const { detail: clientAction } = event
    if (clientAction === ClientActionSave) {
      const { assets } = ClientAssetManagerClass.instance
      const savingAssets = assets.filter(asset => asset.saveNeeded)
      const { length } = savingAssets
      if (length) {
        console.debug('ClientAssetManagerClass handleAction', clientAction, length)
        event.stopImmediatePropagation()
        ClientAssetManagerClass.saving = true
        const firstAsset = savingAssets.shift()
        assertAsset(firstAsset) 

        let promise = firstAsset.savePromise
        savingAssets.forEach(asset =>  {
          promise = promise.then(orError => (
            isDefiniteError(orError) ? orError : asset.savePromise
          ))
        })
        promise = promise.then(orError => {
          ClientAssetManagerClass.saving = false
          if (isDefiniteError(orError)) {
            console.error('ClientAssetManagerClass handleAction', clientAction, orError)
          }
          return orError
        })
      }
    }
  }

  static handleManagedAsset(event: EventManagedAsset) {
    const { instance } = ClientAssetManagerClass
    const { detail } = event
    const { assetObject, assetId, manageType } = detail
    const asset = instance.define(assetObject || assetId, manageType)
    detail.asset = asset
    if (idIsTemporary(asset.id)) {
      MovieMasher.eventDispatcher.dispatch(new EventChangedActionEnabled(ClientActionSave))
    }
    event.stopImmediatePropagation()
  }

  static handleManagedAssetIcon(event: EventManagedAssetIcon) {
    const { detail } = event
    const { assetId, size } = detail
    const { instance } = ClientAssetManagerClass
    const asset = instance.fromId(assetId)
    detail.promise = asset.definitionIcon(size) 
  }
  
  static handleManagedAssetId(event: EventManagedAssetId) {
    const { instance } = ClientAssetManagerClass
    const { previousId, currentId } = event.detail
    instance.updateDefinitionId(previousId, currentId)
    event.stopImmediatePropagation()
    if (idIsTemporary(previousId)) {
      MovieMasher.eventDispatcher.dispatch(new EventChangedActionEnabled(ClientActionSave))
    }
  }

  static handleManagedAssetScalar(event: EventManagedAssetScalar) {
    const { detail } = event
    const { assetId, propertyName } = detail
    const { instance } = ClientAssetManagerClass
    const asset = instance.fromId(assetId)
    detail.scalar = asset.value(propertyName) 
  }

  static handleReleaseAssets(event: EventReleaseManagedAssets) {
    const { instance } = ClientAssetManagerClass
    const { detail: manageType } = event
    instance.undefine(manageType)
    event.stopImmediatePropagation()
  }

  private static _instance?: ClientAssetManagerClass
  static get instance(): ClientAssetManagerClass {
    return this._instance ||= new ClientAssetManagerClass()
  }

  private static _saving = false 
  private static get saving() { return ClientAssetManagerClass._saving }
  private static set saving(value) {
    if (ClientAssetManagerClass._saving !== value) {
      ClientAssetManagerClass._saving = value
      MovieMasher.eventDispatcher.dispatch(new EventChangedActionEnabled(ClientActionSave))
    }
  }
}



// listen for managed asset id changed event
MovieMasher.eventDispatcher.addDispatchListener(
  EventManagedAssetId.Type, ClientAssetManagerClass.handleManagedAssetId
)

// listen for managed asset icon event
MovieMasher.eventDispatcher.addDispatchListener(
  EventManagedAssetIcon.Type, ClientAssetManagerClass.handleManagedAssetIcon
)

// listen for managed asset event
MovieMasher.eventDispatcher.addDispatchListener(
  EventManagedAsset.Type, ClientAssetManagerClass.handleManagedAsset
)

// listen for release assets event
MovieMasher.eventDispatcher.addDispatchListener(
  EventReleaseManagedAssets.Type, ClientAssetManagerClass.handleReleaseAssets
)

// listen for managed asset scalar event
MovieMasher.eventDispatcher.addDispatchListener(
  EventManagedAssetScalar.Type, ClientAssetManagerClass.handleManagedAssetScalar
)

// listen for action enabled event
MovieMasher.eventDispatcher.addDispatchListener(
  EventActionEnabled.Type, ClientAssetManagerClass.handleActionEnabled
)

// listen for action enabled event
MovieMasher.eventDispatcher.addDispatchListener(
  EventAction.Type, ClientAssetManagerClass.handleAction
)
