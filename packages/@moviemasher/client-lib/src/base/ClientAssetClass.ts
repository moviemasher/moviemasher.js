import type { ClientAsset, ClientImageDataOrError, ServerProgress } from '../types.js'
import type { AssetObject, ClientMediaRequest, DataOrError, InstanceArgs, InstanceObject, Rect, Requestable, Requestables, Size, StringDataOrError, TargetId, TranscodingTypes } from '@moviemasher/shared-lib/types.js'

import { AssetClass } from '@moviemasher/shared-lib/base/asset.js'
import { MOVIEMASHER, jsonStringify } from '@moviemasher/shared-lib/runtime.js'
import { EventClientImagePromise, EventManagedAsset, EventManagedAssetId, EventSave } from '../utility/events.js'
import { ASSET_TARGET, ERROR, assertAsset, errorPromise, errorThrow, idIsTemporary, isDefiniteError } from '@moviemasher/shared-lib/runtime.js'
import { assertSizeAboveZero, centerPoint, sizeAboveZero, sizeCopy, sizeCover } from '@moviemasher/shared-lib/utility/rect.js'
import { svgImagePromise } from '../utility/svg.js'
import { svgSetDimensions } from '@moviemasher/shared-lib/utility/svg.js'

export class ClientAssetClass extends AssetClass implements ClientAsset {
  override asset(assetIdOrObject: string | AssetObject): ClientAsset {
    const event = new EventManagedAsset(assetIdOrObject)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    assertAsset(asset, jsonStringify(assetIdOrObject))

    return asset
  }
  
  assetIcon(_: Size): Promise<DataOrError<Element>> { 
    // console.log(this.constructor.name, 'assetIcon!!')
    return errorPromise(ERROR.Unavailable) 
  }

  imagePromise(request: ClientMediaRequest): Promise<ClientImageDataOrError> {
    // console.log(this.constructor.name, 'imagePromise')
    const event = new EventClientImagePromise(request)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return errorPromise(ERROR.Unimplemented, EventClientImagePromise.Type)

    return promise
  }

  assetIconPromise(requestable: Requestable, options: Rect | Size, cover?: boolean): Promise<DataOrError<SVGImageElement>> {
    if (!sizeAboveZero(options)) return errorPromise(ERROR.Unknown, 'size')
   
    return this.imagePromise(requestable.request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientImage } = orError
      const { width, height, src } = clientImage

      // console.log(this.constructor.name, 'assetIconPromise -> imagePromise', width, height, src)

      return svgImagePromise(src).then(svgImage => {
        // console.log(this.constructor.name, 'assetIconPromise -> svgImagePromise', svgImage?.constructor.name)

        const inSize = { width, height }
        assertSizeAboveZero(inSize)

        const size = sizeCopy(options)
        const coverSize = sizeCover(inSize, size, !cover)
        const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
        return { data: svgSetDimensions(svgImage, outRect) }
      })
    })
  }
  
  override instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }

  preferredTranscoding(...types: TranscodingTypes): Requestable | undefined {
    for (const type of types) {
      const found = this.transcodings.find(object => object.type === type)
      if (found) return found
    }
    return
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

  transcodings: Requestables = []
  
  unload(): void {
    // console.log(this.constructor.name, 'unload', this.id)
    
  }
}
