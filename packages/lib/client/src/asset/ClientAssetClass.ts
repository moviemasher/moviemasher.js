import type { ClientAsset, Transcoding, Transcodings } from '@moviemasher/runtime-client'
import type { InstanceArgs, InstanceObject, Size, StringDataOrError, Strings, TargetId, TranscodingType, TranscodingTypes } from '@moviemasher/runtime-shared'

import { AssetClass, idIsTemporary } from '@moviemasher/lib-shared'
import { EventManagedAssetId, EventSave, MovieMasher, TypeAsset } from '@moviemasher/runtime-client'
import { ErrorName, errorPromise, isDefiniteError } from '@moviemasher/runtime-shared'

export class ClientAssetClass extends AssetClass implements ClientAsset {
  definitionIcon(_size: Size): Promise<SVGSVGElement> | undefined { return }
  
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

  get saveNeeded(): boolean { return idIsTemporary(this.id) }

  get savePromise(): Promise<StringDataOrError> { 
    const { saveNeeded } = this
    if (!saveNeeded) return Promise.resolve({ data: '' })

    const event = new EventSave(this.assetObject)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return errorPromise(ErrorName.Unimplemented)
  
    return promise.then(orError => {
      if (!isDefiniteError(orError)) {
        const { data: newId } = orError
        if (newId) {
          MovieMasher.eventDispatcher.dispatch(new EventManagedAssetId(this.id, newId))
          console.debug(this.constructor.name, 'savePromise', this.id, newId)
          this.id = newId
        }
      }
      return orError
    })
  }

  override targetId: TargetId = TypeAsset

  transcodings: Transcodings = []
}
