import type { ClientAsset, ServerProgress } from '@moviemasher/runtime-client'
import type { AssetObject, InstanceArgs, Transcoding, Transcodings, InstanceObject, Size, StringDataOrError, Strings, TargetId, TranscodingType, TranscodingTypes } from '@moviemasher/runtime-shared'

import { AssetClass, idIsTemporary } from '@moviemasher/lib-shared'
import { EventManagedAsset, EventManagedAssetId, EventSave, MovieMasher } from '@moviemasher/runtime-client'
import { ERROR, TypeAsset, assertAsset, errorPromise, isDefiniteError } from '@moviemasher/runtime-shared'

export class ClientAssetClass extends AssetClass implements ClientAsset {
  override asset(assetId: string | AssetObject): ClientAsset {
    const event = new EventManagedAsset(assetId)
    MovieMasher.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    assertAsset(asset)

    return asset
  }
  
  assetIcon(_size: Size): Promise<SVGSVGElement> | undefined { return }
  
  findTranscoding(transcodingType: TranscodingType, ...kinds: Strings): Transcoding | undefined {
    return this.transcodings.find(transcoding => {
      const { type, kind } = transcoding
      if (transcodingType !== type) return false
      if (kinds.length && !kinds.includes(kind)) return false
      return true
    })
  }

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

  override targetId: TargetId = TypeAsset

  transcodings: Transcodings = []
}
