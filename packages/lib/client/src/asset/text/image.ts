import type { ClientFont, ClientTextAsset, ClientTextAssetObject, ClientTextInstance, Panel, Transcoding,SvgItem, ClientFontDataOrError } from '@moviemasher/runtime-client'
import type { AssetCacheArgs, InstanceArgs, Property, Rect, Scalar, Size, TextInstance, TextInstanceObject, Time,  } from '@moviemasher/runtime-shared'

import { EmptyFunction, TextAssetMixin, TextHeight, TextInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin, assertPopulatedString, assertRequest, centerPoint, colorCurrent, rectTransformAttribute, sizeCover, stringFamilySizeRect,} from '@moviemasher/lib-shared'
import { EventAsset, EventClientFontPromise, MovieMasher, isPropertyId } from '@moviemasher/runtime-client'
import { DotChar, SourceText, TypeFont, TypeImage, errorThrow, isAssetObject, isDefiniteError, POINT_ZERO, isPopulatedString, ErrorName, errorPromise } from '@moviemasher/runtime-shared'
import { ClientRawAssetClass } from '../raw/ClientRawAssetClass.js'
import { ClientInstanceClass } from '../../instance/ClientInstanceClass.js'
import { ClientVisibleAssetMixin } from '../../Client/Visible/ClientVisibleAssetMixin.js'
import { svgText, svgSvgElement } from '../../Client/SvgFunctions.js'
import { ClientVisibleInstanceMixin } from '../../Client/Visible/ClientVisibleInstanceMixin.js'

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
    return this.loadFontPromise(this.findTranscoding(TypeFont)).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError)

      const { string, family } = this
      assertPopulatedString(family)
      assertPopulatedString(string)
      
      const inSize = this.intrinsicRect
      const coverSize = sizeCover(inSize, size, true)
      const outRect = { ...coverSize, ...centerPoint(size, coverSize) }

      const transform = rectTransformAttribute(inSize, outRect)
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
    const { family, string } = this
    if (!(isPopulatedString(family) && isPopulatedString(string))) {
      return { width: 0, height: TextHeight, ...POINT_ZERO }
    }
    return stringFamilySizeRect(string, family, TextHeight)
  }
  
  private loadFontPromise(transcoding?: Transcoding): Promise<ClientFontDataOrError> {
    // console.log(this.constructor.name, 'loadFontPromise', transcoding)
    if (this.loadedFont) return Promise.resolve({ data: this.loadedFont })
    
    const { request } = transcoding || this
    assertRequest(request)

    const event = new EventClientFontPromise(request)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return errorPromise(ErrorName.Unimplemented)

    return promise!.then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data: loadedFont } = orError      
      this.family = loadedFont.family
      this.loadedFont = loadedFont
      return orError
    })
  } 

  private loadedFont?: ClientFont

  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, TypeImage, SourceText)) {
      detail.asset = new ClientTextAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

// listen for image/text asset event
MovieMasher.eventDispatcher.addDispatchListener(
  EventAsset.Type, ClientTextAssetClass.handleAsset
)

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
    const { asset, string } = this
    if (!string) return { width: 0, height: TextHeight, ...POINT_ZERO }

    const { family } = asset
    assertPopulatedString(family)

    return stringFamilySizeRect(string, family, TextHeight)
  }

  override pathElement(rect: Rect): SvgItem {
    const { string, asset: definition } = this
    const { family } = definition    
    const transform = rectTransformAttribute(this.intrinsicRect(true), rect)
    return svgText(string, family, TextHeight, transform)
  }

  override setValue(id: string, value?: Scalar, property?: Property): void {
    super.setValue(id, value, property)
    if (property) return

    const name = isPropertyId(id) ? id.split(DotChar).pop() : id
    switch (name) {
      case 'string': {
        console.log(this.constructor.name, 'setValue', name, value)
        delete this.intrinsic
        break 
      }
    }
  }
}
