import type { ClientAsset, ServerProgress } from '@moviemasher/runtime-client'
import type { AssetObject, InstanceArgs, Transcoding, Transcodings, InstanceObject, Size, StringDataOrError, TargetId, TranscodingTypes } from '@moviemasher/runtime-shared'

import { AssetClass, idIsTemporary } from '@moviemasher/lib-shared'
import { EventManagedAsset, EventManagedAssetId, EventSave, MovieMasher } from '@moviemasher/runtime-client'
import { ERROR, ASSET, errorPromise, isDefiniteError } from '@moviemasher/runtime-shared'

export class ClientAssetClass extends AssetClass implements ClientAsset {
  override asset(assetIdOrObject: string | AssetObject): ClientAsset {
    return EventManagedAsset.asset(assetIdOrObject)
  }
  
  assetIcon(_size: Size): Promise<SVGSVGElement> | undefined { return }

  override instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }

  preferredTranscoding(...types: TranscodingTypes): Transcoding | undefined {
    for (const type of types) {
      const found = this.transcodings.find(object => object.type === type)
      if (found) return found
    }
    return
  }

  protected saveId(newId?: string) {
    if (!newId) return

    const { id: oldId } = this
    if (newId !== oldId) {
      this.id = newId
      // console.debug(this.constructor.name, 'savePromise', oldId, newId)
      MovieMasher.eventDispatcher.dispatch(new EventManagedAssetId(oldId, newId))
    }
  }
  get saveNeeded(): boolean { return idIsTemporary(this.id) }

  protected savingPromise(progress?: ServerProgress): Promise<StringDataOrError> {
    const event = new EventSave(this, progress)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return errorPromise(ERROR.Unimplemented)
  
    return promise
  }

  savePromise(progress?: ServerProgress): Promise<StringDataOrError> { 
    const promise = this.savingPromise(progress)
    return promise.then(orError => {
      // console.log(this.constructor.name, 'savePromise', orError)
      if (!isDefiniteError(orError)) this.saveId(orError.data)
      return orError
    })
  }

  override targetId: TargetId = ASSET

  transcodings: Transcodings = []
}
