import type { ClientAsset, ClientAssetManager, ClientAssets } from "@moviemasher/runtime-client"
import type { AssetObject, AssetType, ManageType } from '@moviemasher/runtime-shared'

import { AssetManagerClass } from '@moviemasher/runtime-shared'
import { EventAsset, EventManagedAsset, EventManagedAssetIcon, EventManagedAssetId, EventManagedAssetScalar, EventReleaseManagedAssets, MovieMasher, isClientAsset } from '@moviemasher/runtime-client'


export class ClientAssetManagerClass extends AssetManagerClass implements ClientAssetManager {
  protected override asset(object: AssetObject): ClientAsset {
    const event = new EventAsset(object)
    MovieMasher.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    if (isClientAsset(asset)) this.install(asset)
    return asset as ClientAsset
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

  static handleManagedAsset(event: EventManagedAsset) {
    const { instance } = ClientAssetManagerClass
    const { detail } = event
    const { assetObject, assetId } = detail
    detail.asset = instance.define(assetObject || assetId)
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
}

// listen for managed asset id event
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
