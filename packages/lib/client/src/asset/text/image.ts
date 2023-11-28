import type { ClientFont, ClientFontDataOrError, ClientTextAsset, ClientTextAssetObject, ClientTextInstance, Panel, SvgItem } from '@moviemasher/runtime-client'
import type { AssetCacheArgs, DataOrError, InstanceArgs, ListenersFunction, Property, Rect, Scalar, Size, TextInstance, TextInstanceObject, Time, Transcoding, } from '@moviemasher/runtime-shared'

import { EventAsset, EventClientFontPromise, MOVIEMASHER } from '@moviemasher/runtime-client'
import { CURRENT_COLOR, DOT, ERROR, FONT, IMAGE, POINT_ZERO, RECT_ZERO, TEXT, TEXT_HEIGHT, errorPromise, errorThrow, isAssetObject, isDefiniteError, isPopulatedString } from '@moviemasher/runtime-shared'
import { svgSvgElement, svgText } from '../../utility/svg.js'
import { ClientVisibleAssetMixin } from '../../mixins/ClientVisibleAssetMixin.js'
import { ClientVisibleInstanceMixin } from '../../mixins/ClientVisibleInstanceMixin.js'
import { ClientInstanceClass } from '../../instance/ClientInstanceClass.js'
import { ClientRawAssetClass } from '../raw.js'
import { assertObject, assertPopulatedString, isAboveZero, isPropertyId } from '@moviemasher/lib-shared/utility/guards.js'
import { TextAssetMixin, VisibleAssetMixin } from '@moviemasher/lib-shared/asset/mixins.js'
import { TextInstanceMixin, VisibleInstanceMixin } from '@moviemasher/lib-shared/instance/mixins.js'
import { sizeContain, centerPoint, rectTransformAttribute } from '@moviemasher/lib-shared/utility/rect.js'

const stringFamilySizeRect = (string: string, family: string, size: number): Rect => {
  if (!(isPopulatedString(string) && isAboveZero(size))) return RECT_ZERO

  const { document } = globalThis
  
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  assertObject(ctx, 'ctx')

  ctx.font = `${size}px ${family}`

  const metrics = ctx.measureText(string)

  // const font = new FontFace(family, string)
  const { 
    actualBoundingBoxAscent, 
    actualBoundingBoxDescent, 
    actualBoundingBoxLeft, 
    actualBoundingBoxRight, 
  } = metrics

  const rect = {
    x: actualBoundingBoxLeft, y: actualBoundingBoxAscent,
    width: actualBoundingBoxLeft + actualBoundingBoxRight,
    height: actualBoundingBoxAscent + actualBoundingBoxDescent,
  } 
  // console.log('stringFamilySizeRect', rect, ctx.textBaseline, metrics)
  return rect
}


const WithAsset = VisibleAssetMixin(ClientRawAssetClass)
const WithClientAsset = ClientVisibleAssetMixin(WithAsset)
const WithTextAsset = TextAssetMixin(WithClientAsset)
export class ClientTextAssetClass extends WithTextAsset implements ClientTextAsset {
  constructor(args: ClientTextAssetObject) {
    super(args)
    this.initializeProperties(args)
  }
  override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const { visible } = args
    const { family } = this
    if (family || !visible) return Promise.resolve({ data: 0 })

    const transcoding =  this.preferredTranscoding(FONT) 
    return this.loadFontPromise(transcoding).then(() => ({ data: 1 }))
  }

  override assetIcon(size: Size): Promise<SVGSVGElement> | undefined {
    return this.loadFontPromise().then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError)

      const { string, family } = this
      assertPopulatedString(family)
      assertPopulatedString(string)
      
      const inSize = this.intrinsicRect
      const coverSize = sizeContain(inSize, size)
      const outRect = { ...coverSize, ...centerPoint(size, coverSize) }

      const transform = rectTransformAttribute(inSize, outRect)
      const textElement = svgText(this.string, family, TEXT_HEIGHT, transform, CURRENT_COLOR)
    
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
      return { width: 0, height: TEXT_HEIGHT, ...POINT_ZERO }
    }
    return stringFamilySizeRect(string, family, TEXT_HEIGHT)
  }
  
  private loadFontPromise(transcoding?: Transcoding): Promise<ClientFontDataOrError> {
    // console.log(this.constructor.name, 'loadFontPromise', transcoding)
    if (this.loadedFont) return Promise.resolve({ data: this.loadedFont })
    
    const { request } = transcoding || this

    const event = new EventClientFontPromise(request)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return errorPromise(ERROR.Unimplemented)

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
    if (isAssetObject(assetObject, IMAGE, TEXT)) {
      detail.asset = new ClientTextAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

// listen for image/text asset event
export const ClientTextImageListeners: ListenersFunction = () => ({
  [EventAsset.Type]: ClientTextAssetClass.handleAsset
})

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
    if (!string) return { width: 0, height: TEXT_HEIGHT, ...POINT_ZERO }

    const { family } = asset
    assertPopulatedString(family)

    return stringFamilySizeRect(string, family, TEXT_HEIGHT)
  }

  override pathElement(rect: Rect): SvgItem {
    const { string, asset: definition } = this
    const { family } = definition    
    const transform = rectTransformAttribute(this.intrinsicRect(true), rect)
    return svgText(string, family, TEXT_HEIGHT, transform)
  }

  override setValue(id: string, value?: Scalar, property?: Property): void {
    super.setValue(id, value, property)
    if (property) return

    const name = isPropertyId(id) ? id.split(DOT).pop() : id
    switch (name) {
      case 'string': {
        // console.log(this.constructor.name, 'setValue', name, value)
        delete this.intrinsic
        break 
      }
    }
  }
}
