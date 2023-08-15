import type { ClientImage, ClientRawImageAsset, ClientRawImageAssetObject, ClientRawImageInstance, SvgItem } from '@moviemasher/runtime-client'
import type { AssetCacheArgs, ImageInstance, ImageInstanceObject, InstanceArgs, Rect, RectOptions, Size, Time, } from '@moviemasher/runtime-shared'

import { ImageAssetMixin, ImageInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin, assertSizeAboveZero, centerPoint, sizeContain, } from '@moviemasher/lib-shared'
import { EventAsset, EventClientImagePromise, MovieMasher } from '@moviemasher/runtime-client'
import { SourceRaw, TypeImage, errorThrow, isAssetObject, isDefiniteError } from '@moviemasher/runtime-shared'
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
  
  override assetCachePromise(args: AssetCacheArgs): Promise<void> {
    const { visible } = args
    if (!visible) return Promise.resolve()

    const { loadedImage } = this
    if (loadedImage) return Promise.resolve()

    const transcoding = this.preferredTranscoding(TypeImage) 
    if (!transcoding) return Promise.resolve()
    
    const { request } = transcoding
    const event = new EventClientImagePromise(request)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    return promise!.then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientImage } = orError
      console.log(this.constructor.name, 'assetCachePromise setting loadedImage')
      this.loadedImage = clientImage
      return
    })
  }

  override definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    // console.debug(this.constructor.name, 'definitionIcon', { size })
    const transcoding = this.preferredTranscoding(TypeImage) || this
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
      console.debug(this.constructor.name, 'definitionIcon', { src })

      const inSize = { width, height }
      const coverSize = sizeContain(inSize, size)
      const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
      const options: RectOptions = { ...outRect } // , lock: LockShortest, shortest: size.width > size.height ? 'height' : 'width' }
      // console.debug(this.constructor.name, 'definitionIcon calling svgImagePromiseWithOptions', { options })
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
    if (!asset && isAssetObject(assetObject, TypeImage, SourceRaw)) {
      detail.asset = new ClientRawImageAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

// listen for image/raw asset event
MovieMasher.eventDispatcher.addDispatchListener(
  EventAsset.Type, ClientRawImageAssetClass.handleAsset
)

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
    const requestable = asset.preferredTranscoding(TypeImage) || asset
    if (!requestable) {
      console.debug(this.constructor.name, 'svgItemForTimelinePromise no requestable')
      return errorThrow(`No requestable for ${TypeImage}`)
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
