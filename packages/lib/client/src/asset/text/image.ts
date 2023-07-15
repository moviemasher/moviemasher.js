import type { 
  ClientTextAsset,
  ClientTextAssetObject, ClientTextInstance,
  Panel,
  ClientFont,
  ClientFontEvent, ClientFontEventDetail, SvgItem
} from '@moviemasher/runtime-client'

import type {
  AssetCacheArgs,
  AssetEventDetail,
  InstanceArgs,
  Property, Rect, Scalar, Size,
  TextInstance, TextInstanceObject,
  Time, Transcoding,
} from '@moviemasher/runtime-shared'

import {
  ClientInstanceClass,
  ClientRawAssetClass, ClientVisibleAssetMixin, ClientVisibleInstanceMixin,
  EmptyFunction,
  PointZero,
  TextAssetMixin,
  TextHeight,
  TextInstanceMixin, VisibleAssetMixin,
  VisibleInstanceMixin, 
  assertPopulatedString, assertRequest, centerPoint,
  colorCurrent, 
  sizeCover, stringFamilySizeRect,
  svgSvgElement, svgText, svgTransform
} from '@moviemasher/lib-shared'
import { 
 MovieMasher, EventTypeClientFont
} from '@moviemasher/runtime-client'
import {
  isDefiniteError, SourceText,
  TypeFont,
  TypeImage,
  errorThrow,
  isAssetObject, isPopulatedString
} from '@moviemasher/runtime-shared'

const WithAsset = VisibleAssetMixin(ClientRawAssetClass)
const WithClientAsset = ClientVisibleAssetMixin(WithAsset)
const WithTextAsset = TextAssetMixin(WithClientAsset)

export class ClientTextAssetClass extends WithTextAsset implements ClientTextAsset {
  constructor(args: ClientTextAssetObject) {
    super(args)
    this.initializeProperties(args)
  }
  override assetCachePromise(args: AssetCacheArgs): Promise<void> {
    const { visible } = args
    const { family } = this
    if (family || !visible) return Promise.resolve()

    const transcoding =  this.findTranscoding(TypeFont, 'woff', 'woff2') 
    return this.loadFontPromise(transcoding).then(EmptyFunction)
  }

  override definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    return this.loadFontPromise(this.findTranscoding(TypeFont)).then(() => {
      const { string, family } = this
      assertPopulatedString(family)
      assertPopulatedString(string)
      
      const inSize = this.intrinsicRect
      const coverSize = sizeCover(inSize, size, true)
      const outRect = { ...coverSize, ...centerPoint(size, coverSize) }


      const transform = svgTransform(inSize, outRect)
      const textElement = svgText(this.string, family, TextHeight, transform, colorCurrent)
    
      return Promise.resolve(svgSvgElement(size, textElement))
    })
    
  }

  override get family(): string {
    if (!this._family) {
      const { loadedFont } = this
      if (loadedFont) {
        const { family } = loadedFont
        if (isPopulatedString(family)) this._family = family
      }
    }
    return super.family
  }

  override set family(value: string) { this._family = value }


  override initializeProperties(object: ClientTextAssetObject): void {
    const { loadedFont } = object
    if (loadedFont) this.loadedFont = loadedFont
    
    super.initializeProperties(object)
  }
  
  override instanceFromObject(object?: TextInstanceObject): TextInstance {
    const args = this.instanceArgs(object)
    return new ClientTextInstanceClass(args)
  }

  protected _intrinsicRect?: Rect

  private get intrinsicRect(): Rect { 
    return this._intrinsicRect ||= this.intrinsicRectInitialize()
  }

  private intrinsicRectInitialize(): Rect {
    const height = TextHeight
    const dimensions = { width: 0, height, ...PointZero }
    const { family, string } = this

    if (!(isPopulatedString(family) && isPopulatedString(string))) return dimensions

    const rect = stringFamilySizeRect(string, family, height)
    return rect
  }
  
  private loadFontPromise(transcoding?: Transcoding): Promise<ClientFont> {
    // console.log(this.constructor.name, 'loadFontPromise', transcoding)
    if (this.loadedFont) return Promise.resolve(this.loadedFont)
    
    const { request } = transcoding || this
    assertRequest(request)


    const detail: ClientFontEventDetail = { request }
    const event: ClientFontEvent = new CustomEvent(EventTypeClientFont, { detail })
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = detail
    return promise!.then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: loadedFont } = orError      
      this.family = loadedFont.family
      this.loadedFont = loadedFont
      return loadedFont
    })
  } 

   private loadedFont?: ClientFont
}

const WithInstance = VisibleInstanceMixin(ClientInstanceClass)
const WithClientInstance = ClientVisibleInstanceMixin(WithInstance)
const WithTextInstance = TextInstanceMixin(WithClientInstance)

export class ClientTextInstanceClass extends WithTextInstance implements ClientTextInstance {
  constructor(args: TextInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }

  declare asset: ClientTextAsset
  
  override containerSvgItemPromise(containerRect: Rect, _time: Time, _component: Panel): Promise<SvgItem> {
    return Promise.resolve(this.pathElement(containerRect))
  }

  override intrinsicRect(_ = false): Rect { 
    return this.intrinsic ||= this.intrinsicRectInitialize()
  }

  private intrinsicRectInitialize(): Rect {
    const { family } = this.asset
    assertPopulatedString(family)

    const clipString = this.string
    const height = TextHeight
    const dimensions: Rect = { width: 0, height, ...PointZero }
    if (!clipString) return dimensions

    const rect = stringFamilySizeRect(clipString, family, height)
    return rect
  }

  override pathElement(rect: Rect): SvgItem {
    const { string, asset: definition } = this
    const { family } = definition    
    const transform = svgTransform(this.intrinsicRect(true), rect)
    return svgText(string, family, TextHeight, transform)
  }
  

  override setValue(value: Scalar, name: string, property?: Property): void {
    super.setValue(value, name, property)
    if (property) return

    switch (name) {
      case 'string':
        delete this._intrinsicRect
        break
    }
  }
}

// listen for image/text asset event
MovieMasher.eventDispatcher.addDispatchListener<AssetEventDetail>('asset', event => {
  const { detail } = event
  const { assetObject, asset } = detail
  if (!asset && isAssetObject(assetObject, TypeImage, SourceText)) {
    detail.asset = new ClientTextAssetClass(assetObject)
    event.stopImmediatePropagation()
  }
})
