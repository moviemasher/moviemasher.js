import type { ClientAsset, ClientImageDataOrError } from '../types.js'
import type { AssetObject, DataOrError, ServerProgress, InstanceArgs, InstanceObject, Rect, Resource, Size, StringDataOrError, TargetId } from '@moviemasher/shared-lib/types.js'

import { AssetClass } from '@moviemasher/shared-lib/base/asset.js'
import { $RETRIEVE, MOVIEMASHER, jsonStringify, namedError } from '@moviemasher/shared-lib/runtime.js'
import { EventManagedAsset, EventManagedAssetId, EventSave } from '../utility/events.js'
import { $ASSET, ERROR, assertAsset, errorPromise, idIsTemporary, isDefiniteError } from '@moviemasher/shared-lib/runtime.js'
import { assertSizeNotZero, sizeNotZero, copySize, coverSize } from '@moviemasher/shared-lib/utility/rect.js'
import { svgImagePromiseWithOptions, svgSetDimensions } from '@moviemasher/shared-lib/utility/svg.js'
import { centerPoint } from '../runtime.js'
import { isClientImage } from '@moviemasher/shared-lib/utility/guard.js'

export class ClientAssetClass extends AssetClass implements ClientAsset {
  override asset(assetIdOrObject: string | AssetObject): ClientAsset {
    const event = new EventManagedAsset(assetIdOrObject)
    MOVIEMASHER.dispatch(event)
    const { asset } = event.detail
    assertAsset(asset, jsonStringify(assetIdOrObject))

    return asset
  }
  
  assetIcon(_: Size): Promise<DataOrError<Element>> { 
    // console.log(this.constructor.name, 'assetIcon!!')
    return errorPromise(ERROR.Unavailable) 
  }

  imagePromise(resource: Resource): Promise<ClientImageDataOrError> {
    return MOVIEMASHER.promise($RETRIEVE, resource).then(functionOrError => {
      if (isDefiniteError(functionOrError)) return functionOrError

      const { response } = resource.request
      if (isClientImage(response)) return { data: response }

      return errorPromise(ERROR.Unknown, 'response')
    })
  }

  assetIconPromise(resource: Resource, options: Rect | Size, cover?: boolean): Promise<DataOrError<SVGImageElement>> {
    if (!sizeNotZero(options)) return errorPromise(ERROR.Unknown, 'size')
   
    return this.imagePromise(resource).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data: clientImage } = orError
      const { width, height, src } = clientImage

      console.log(this.constructor.name, 'assetIconPromise -> imagePromise', width, height, src)

      return svgImagePromiseWithOptions(src).then(svgImage => {
        // console.log(this.constructor.name, 'assetIconPromise -> svgImagePromiseWithOptions', svgImage?.constructor.name)

        const inSize = { width, height }
        assertSizeNotZero(inSize)

        const size = copySize(options)
        const coveredSize = coverSize(inSize, size, !cover)
        const outRect = { ...coveredSize, ...centerPoint(size, coveredSize) }
        return { data: svgSetDimensions(svgImage, outRect) }
      })
    })
  }
  
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
      MOVIEMASHER.dispatch(new EventManagedAssetId(oldId, newId))
    }
  }
  
  get saveNeeded(): boolean { return idIsTemporary(this.id) }

  protected async savingPromise(progress?: ServerProgress): Promise<StringDataOrError> {
    const event = new EventSave(this, progress)
    MOVIEMASHER.dispatch(event)
    const { promise } = event.detail
    if (!promise) return namedError(ERROR.Unimplemented, EventSave.Type)
  
    console.log(this.constructor.name, 'savingPromise awaiting EventSave', this.label)
    return await promise
  }

  async savePromise(progress?: ServerProgress): Promise<StringDataOrError> { 
    const orError = await this.savingPromise(progress)
    if (!isDefiniteError(orError)) {
      // console.log(this.constructor.name, 'ClientAssetClass calling saveId', orError.data)
      this.saveId(orError.data)
    } else {
      console.error(this.constructor.name, 'savePromise', orError)
    }
    return orError

  }

  override targetId: TargetId = $ASSET


  unload(): void {
    // console.log(this.constructor.name, 'unload', this.id)
    
  }
}
