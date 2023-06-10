import { AssetCacheArgs, AssetEventDetail, ClientImage, ClientInstanceClass, ClientRawAssetClass, ClientRawImageAsset, ClientRawImageAssetObject, ClientRawImageInstance, ClientVisibleAssetMixin, ClientVisibleInstanceMixin, ImageAssetMixin, ImageInstance, ImageInstanceMixin, ImageInstanceObject, SvgItem, VisibleAssetMixin, VisibleInstanceMixin, assertSizeAboveZero, centerPoint, clientMediaImagePromise, errorThrow, isDefiniteError, sizeCover, svgImagePromiseWithOptions, svgSvgElement } from '@moviemasher/lib-shared'
import { isAssetObject } from '@moviemasher/lib-shared'

import { MovieMasher } from '@moviemasher/runtime-client'
import { Rect, RectOptions, Size, SourceRaw, Time, TypeImage } from '@moviemasher/runtime-shared'


const WithAsset = VisibleAssetMixin(ClientRawAssetClass)
const WithClientAsset = ClientVisibleAssetMixin(WithAsset)
const WithImageAsset = ImageAssetMixin(WithClientAsset)

export class ClientRawImageAssetClass extends WithImageAsset implements ClientRawImageAsset {
  override assetCachePromise(args: AssetCacheArgs): Promise<void> {
    const { visible } = args
    if (!visible) return Promise.resolve()

    const { loadedImage } = this
    if (loadedImage) return Promise.resolve()

    const transcoding = this.preferredAsset(TypeImage) 
    if (!transcoding) return Promise.resolve()
    
    const { request } = transcoding
    return clientMediaImagePromise(request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientImage } = orError
      console.log(this.constructor.name, 'assetCachePromise setting loadedImage')
      this.loadedImage = clientImage
      return
    })
  }

  override definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    console.log(this.constructor.name, 'definitionIcon', size)
    const transcoding = this.preferredAsset(TypeImage) || this
    if (!transcoding) return undefined

    return clientMediaImagePromise(transcoding.request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientImage } = orError
      console.debug(this.constructor.name, 'definitionIcon', clientImage)
      assertSizeAboveZero(clientImage)

      const { width, height, src } = clientImage
      const inSize = { width, height }
      const coverSize = sizeCover(inSize, size, true)
      const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
      const options: RectOptions = { ...outRect }
      return svgImagePromiseWithOptions(src, options).then(svgImage => {
        console.debug(this.constructor.name, 'definitionIcon svgImagePromiseWithOptions', svgImage)
        
        return svgSvgElement(size, svgImage)
      })
    })
  }

  override initializeProperties(object: ClientRawImageAssetObject): void {
    const { loadedImage } = object
    if (loadedImage) this.loadedImage = loadedImage
    super.initializeProperties(object)
  }

  override instanceFromObject(object?: ImageInstanceObject | undefined): ImageInstance {
    return new ClientRawImageInstanceClass(this.instanceArgs(object))
  }

  loadedImage?: ClientImage 
}

const WithInstance = VisibleInstanceMixin(ClientInstanceClass)
const WithClientInstance = ClientVisibleInstanceMixin(WithInstance)
const WithImageInstance = ImageInstanceMixin(WithClientInstance)

export class ClientRawImageInstanceClass extends WithImageInstance implements ClientRawImageInstance {
  override svgItemForTimelinePromise(rect: Rect, _time: Time, ): Promise<SvgItem> {
    const { asset: definition } = this
    const requestable = definition.preferredAsset(TypeImage)
    if (!requestable) return errorThrow(`No requestable for ${TypeImage}`)
    
    const { request } = requestable
    return clientMediaImagePromise(request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientImage } = orError
      const { src } = clientImage
      const svgImageOptions: RectOptions = { ...rect }
      return svgImagePromiseWithOptions(src, svgImageOptions)
    })
  }
  declare asset: ClientRawImageAsset
}

// listen for image/raw asset event
MovieMasher.eventDispatcher.addDispatchListener<AssetEventDetail>('asset', event => {
  const { detail } = event
  const { assetObject, asset } = detail
  if (!asset && isAssetObject(assetObject, TypeImage, SourceRaw)) {
    detail.asset = new ClientRawImageAssetClass(assetObject)
    event.stopImmediatePropagation()
  }
})
