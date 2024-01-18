import type { AssetCacheArgs, DataOrError, InstanceArgs, ListenersFunction, Rect, Scalar, ScalarTuple, Size, SvgItem, TextInstance, TextInstanceObject, Time, Transcoding } from '@moviemasher/shared-lib/types.js'
import type { ClientFont, ClientFontDataOrError, ClientTextAsset, ClientTextAssetObject, ClientTextInstance, Panel } from '../../types.js'


import { CURRENT_COLOR, ERROR, IMAGE, POINT_ZERO, RECT_ZERO, TEXT, TEXT_HEIGHT, errorPromise, isAssetObject, isDefiniteError, isPopulatedString } from '@moviemasher/shared-lib/runtime.js'
import { assertObject, assertPopulatedString, isAboveZero } from '@moviemasher/shared-lib/utility/guards.js'
import { centerPoint, rectTransformAttribute, sizeContain } from '@moviemasher/shared-lib/utility/rect.js'
import { svgSvgElement, svgText } from '@moviemasher/shared-lib/utility/svg.js'
import { ClientInstanceClass } from '../../base/ClientInstanceClass.js'
import { ClientVisibleAssetMixin } from '../../mixin/visible.js'
import { ClientVisibleInstanceMixin } from '../../mixin/visible.js'
import { MOVIEMASHER } from '@moviemasher/shared-lib/runtime.js'
import { EventAsset, EventClientFontPromise } from '../../utility/events.js'
import { ClientRawAssetClass } from '../raw/raw.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { TextAssetMixin, TextInstanceMixin } from '@moviemasher/shared-lib/mixin/text.js'

const stringFamilySizeRect = (string: string, family: string, size: number): Rect => {
  if (!(isPopulatedString(string) && isAboveZero(size))) return RECT_ZERO

  const { document } = MOVIEMASHER
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  assertObject(ctx, 'ctx')
  // ctx.fontKerning = 'none'
  ctx.font = `${size}px ${family}`
  const metrics = ctx.measureText(string)
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
    if (family || !visible) {
      // console.log(this.constructor.name, 'assetCachePromise NOT CACHING', family, visible)
      return Promise.resolve({ data: 0 })
    }
    return this.loadFontPromise().then(() => ({ data: 1 }))
  }

  override assetIcon(size: Size, _cover?: boolean): Promise<DataOrError<Element>> {
    return this.loadFontPromise().then(orError => {
      if (isDefiniteError(orError)) return orError

      const { string, family } = this
      assertPopulatedString(family)
      assertPopulatedString(string)
      
      const inSize = this.textRect
      const coverSize = sizeContain(inSize, size)
      const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
      const transform = rectTransformAttribute(inSize, outRect)
      const textElement = svgText(this.string, CURRENT_COLOR, TEXT_HEIGHT, family, transform)
      return { data: svgSvgElement(size, textElement) }
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

  protected _textRect?: Rect

  private get textRect(): Rect { 
    return this._textRect ||= this.textRectInitialize()
  }

  private textRectInitialize(): Rect {
    const { family, string } = this
    if (!(isPopulatedString(family) && isPopulatedString(string))) {
      return { width: 0, height: TEXT_HEIGHT, ...POINT_ZERO }
    }
    return stringFamilySizeRect(string, family, TEXT_HEIGHT)
  }
  
  private loadFontPromise(transcoding?: Transcoding): Promise<ClientFontDataOrError> {
    // console.log(this.constructor.name, 'loadFontPromise')
    if (this.loadedFont) {
    // console.log(this.constructor.name, 'loadFontPromise has loadedFont')
      return Promise.resolve({ data: this.loadedFont })
    }
    
    const { request } = transcoding || this

    const event = new EventClientFontPromise(request)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return errorPromise(ERROR.Unimplemented)

    return promise!.then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data: loadedFont } = orError      
      this.family = loadedFont.family
      // console.log(this.constructor.name, 'loadFontPromise LOADED', loadedFont.family)
      this.loadedFont = loadedFont
      return orError
    })
  } 

  private loadedFont?: ClientFont

  override unload(): void {
    super.unload()
    delete this.loadedFont

  }

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
  
  override containerSvgItemPromise(containerRect: Rect, _time: Time, _component: Panel): Promise<DataOrError<SvgItem>> {
    return Promise.resolve({ data: this.pathElement(containerRect) })
  }

  override get intrinsicRect(): Rect { 
    return this.intrinsic ||= this.intrinsicRectInitialize()
  }

  private intrinsicRectInitialize(): Rect {
    const { asset, string } = this
    if (!string) return { width: 0, height: TEXT_HEIGHT, ...POINT_ZERO }

    const { family } = asset
    assertPopulatedString(family)

    return stringFamilySizeRect(string, family, TEXT_HEIGHT)
  }

  override setValue(id: string, value?: Scalar): ScalarTuple {
    const tuple = super.setValue(id, value)
 
    const [name] = tuple
    switch (name) {
      case 'string': {
        // console.log(this.constructor.name, 'setValue', name, value)
        delete this.intrinsic
        break 
      }
    }
    return tuple
  }
}
