import type { ClientAsset, ClientImage, DataOrError, InstanceArgs, InstanceObject, Rect, Resource, ServerProgress, Size, StringDataOrError, TargetId } from '../types.js'

import { AssetClass } from '../base/asset.js'
import { $ASSET, $RETRIEVE, $SAVE, ERROR, MOVIE_MASHER, errorPromise, idIsTemporary, isDefiniteError, namedError } from '../runtime.js'
import { isClientImage } from '../utility/guard.js'
import { assertSizeNotZero, centerPoint, copySize, coverSize, sizeNotZero } from '../utility/rect.js'
import { svgImagePromiseWithOptions, svgSetDimensions } from '../utility/svg.js'

export class ClientAssetClass extends AssetClass implements ClientAsset {
  assetIcon(_size: Size, _cover?: boolean): Promise<DataOrError<Element>> { 
    return errorPromise(ERROR.Unimplemented) 
  }

  assetIconPromise(resource: Resource, options: Rect | Size, cover?: boolean): Promise<DataOrError<SVGImageElement>> {
    if (!sizeNotZero(options)) return errorPromise(ERROR.Unknown, 'size')
   
    return this.imagePromise(resource).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data: clientImage } = orError
      const { width, height, src } = clientImage
      return svgImagePromiseWithOptions(src).then(svgImage => {
        const inSize = { width, height }
        assertSizeNotZero(inSize)

        const size = copySize(options)
        const coveredSize = coverSize(inSize, size, !cover)
        const outRect = { ...coveredSize, ...centerPoint(size, coveredSize) }
        return { data: svgSetDimensions(svgImage, outRect) }
      })
    })
  }
  
  imagePromise(resource: Resource): Promise<DataOrError<ClientImage>> {
    return MOVIE_MASHER.promise(resource, $RETRIEVE).then(functionOrError => {
      if (isDefiniteError(functionOrError)) return functionOrError

      const { response } = resource.request
      if (isClientImage(response)) return { data: response }

      return errorPromise(ERROR.Unknown, 'response')
    })
  }

  override instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }

  protected saveId(newId?: string) {
    if (!newId) return

    const { id: oldId } = this
    if (newId === oldId) return

    this.id = newId
    const { assetManager: instance} = this
    instance.updateDefinitionId(oldId, newId)
  }
  
  get saveNeeded(): boolean { return idIsTemporary(this.id) }

  async savePromise(progress?: ServerProgress): Promise<StringDataOrError> { 
    const orError = await this.savingPromise(progress)
    if (!isDefiniteError(orError)) this.saveId(orError.data)
    return orError
  }

  protected async savingPromise(progress?: ServerProgress): Promise<StringDataOrError> {
    const promise = MOVIE_MASHER.promise(this, $SAVE, { progress })
    if (!promise) return namedError(ERROR.Unimplemented, $SAVE)
  
    return await promise
  }

  override targetId: TargetId = $ASSET

  unload(): void {}
}
