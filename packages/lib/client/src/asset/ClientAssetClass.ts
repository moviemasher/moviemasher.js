import type { ClientAsset, ServerProgress } from '@moviemasher/runtime-client'
import type { AssetObject, InstanceArgs, InstanceObject, Size, StringDataOrError, TargetId } from '@moviemasher/runtime-shared'

import { AssetClass } from '@moviemasher/lib-shared/base/asset.js'
import { EventManagedAsset, EventManagedAssetId, EventSave, MOVIEMASHER } from '@moviemasher/runtime-client'
import { ASSET_TARGET, ERROR, assertAsset, errorPromise, idIsTemporary, isDefiniteError } from '@moviemasher/runtime-shared'

export class ClientAssetClass extends AssetClass implements ClientAsset {
  override asset(assetIdOrObject: string | AssetObject): ClientAsset {
    const event = new EventManagedAsset(assetIdOrObject)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    assertAsset(asset)

    return asset
  }
  
  assetIcon(_size: Size): Promise<SVGSVGElement> | undefined { return }
  
  override instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }


  protected saveId(newId?: string) {
    const { id: oldId } = this
    // console.log(this.constructor.name, 'saveId', newId)
    if (!newId) return

    if (newId !== oldId) {
      this.id = newId
      // console.debug(this.constructor.name, 'saveId', oldId, newId)
      MOVIEMASHER.eventDispatcher.dispatch(new EventManagedAssetId(oldId, newId))
    }
  }
  
  get saveNeeded(): boolean { return idIsTemporary(this.id) }

  protected savingPromise(progress?: ServerProgress): Promise<StringDataOrError> {
    const event = new EventSave(this, progress)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return errorPromise(ERROR.Unimplemented)
  
    return promise
  }

  savePromise(progress?: ServerProgress): Promise<StringDataOrError> { 
    const promise = this.savingPromise(progress)
    return promise.then(orError => {
      // console.log(this.constructor.name, 'ClientAssetClass savingPromise result', orError)
      
      if (!isDefiniteError(orError)) {
        // console.log(this.constructor.name, 'ClientAssetClass calling saveId', orError.data)
        this.saveId(orError.data)
      } else {
        // console.error(this.constructor.name, 'savePromise', orError)
      }
      return orError
    })
  }

  override targetId: TargetId = ASSET_TARGET

}
