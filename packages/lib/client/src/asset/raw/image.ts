import type { ClientImage, ClientRawImageAsset, ClientRawImageAssetObject, ClientRawImageInstance, SvgItem } from '@moviemasher/runtime-client'
import type { AssetCacheArgs, DataOrError, ImageInstance, ImageInstanceObject, InstanceArgs, Rect, RectOptions, Size, Time, } from '@moviemasher/runtime-shared'

import { ImageAssetMixin, ImageInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin, assertSizeAboveZero, centerPoint, sizeCover } from '@moviemasher/lib-shared'
import { EventAsset, EventClientImagePromise, MovieMasher } from '@moviemasher/runtime-client'
import { RAW, IMAGE, errorThrow, isAssetObject, isDefiniteError, errorPromise, ERROR } from '@moviemasher/runtime-shared'
import { svgImagePromiseWithOptions, svgSvgElement } from '../../Client/SvgFunctions.js'
import { ClientVisibleAssetMixin } from '../../Client/Visible/ClientVisibleAssetMixin.js'
import { ClientVisibleInstanceMixin } from '../../Client/Visible/ClientVisibleInstanceMixin.js'
import { ClientInstanceClass } from '../../instance/ClientInstanceClass.js'
import { ClientRawAssetClass } from './ClientRawAssetClass.js'

const WithAsset = VisibleAssetMixin(ClientRawAssetClass)
const WithClientAsset = ClientVisibleAssetMixin(WithAsset)
const WithImageAsset = ImageAssetMixin(WithClientAsset)

export class ClientRawImageAssetClass extends WithImageAsset implements ClientRawImageAsset {
  constructor(args: ClientRawImageAssetObject) {
    super(args)
    this.initializeProperties(args)
  }
  
  override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const { visible } = args
    if (!visible) return Promise.resolve({ data: 0 })

    const { loadedImage } = this
    if (loadedImage) return Promise.resolve({ data: 0 })

    const transcoding = this.preferredTranscoding(IMAGE) 
    if (!transcoding) return Promise.resolve({ data: 0 })
    
    const { request } = transcoding
    const event = new EventClientImagePromise(request)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return errorPromise(ERROR.Unimplemented, EventClientImagePromise.Type)
    
    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data: clientImage } = orError
      // console.log(this.constructor.name, 'assetCachePromise setting loadedImage')
      this.loadedImage = clientImage
      return { data: 1 }
    })
  }

  override assetIcon(size: Size, cover?: boolean): Promise<SVGSVGElement> | undefined {
    // console.debug(this.constructor.name, 'assetIcon', { size })
    const transcoding = this.preferredTranscoding(IMAGE) || this
    if (!transcoding) return undefined
    
    const { request } = transcoding
    const event = new EventClientImagePromise(request)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    return promise!.then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientImage } = orError
      assertSizeAboveZero(clientImage)

      const { width, height, src } = clientImage
      // console.debug(this.constructor.name, 'assetIcon', { src })

      const inSize = { width, height }
      const coverSize = sizeCover(inSize, size, !cover)
      const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
      const options: RectOptions = { ...outRect } // , lock: LockShortest, shortest: size.width > size.height ? 'height' : 'width' }
      // console.debug(this.constructor.name, 'assetIcon calling svgImagePromiseWithOptions', { options })
      return svgImagePromiseWithOptions(src, options).then(svgImage => {
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

  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject, asset } = detail
    if (!asset && isAssetObject(assetObject, IMAGE, RAW)) {
      detail.asset = new ClientRawImageAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

// listen for image/raw asset event
export const ClientRawImageListeners = () => ({
  [EventAsset.Type]: ClientRawImageAssetClass.handleAsset
})

const WithInstance = VisibleInstanceMixin(ClientInstanceClass)
const WithClientInstance = ClientVisibleInstanceMixin(WithInstance)
const WithImageInstance = ImageInstanceMixin(WithClientInstance)

export class ClientRawImageInstanceClass extends WithImageInstance implements ClientRawImageInstance {
  constructor(args: ImageInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }

  override svgItemForTimelinePromise(rect: Rect, _time: Time, ): Promise<SvgItem> {
    const { asset } = this
    const requestable = asset.preferredTranscoding(IMAGE) || asset
    if (!requestable) {
      // console.debug(this.constructor.name, 'svgItemForTimelinePromise no requestable')
      return errorThrow(`No requestable for ${IMAGE}`)
    }
    
    const { request } = requestable

    const event = new EventClientImagePromise(request)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail

    return promise!.then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientImage } = orError
      const { src } = clientImage
      const svgImageOptions: RectOptions = { ...rect }
      return svgImagePromiseWithOptions(src, svgImageOptions)
    })
  }
  declare asset: ClientRawImageAsset
}
