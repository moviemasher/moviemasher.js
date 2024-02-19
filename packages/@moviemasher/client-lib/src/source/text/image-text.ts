import type { AssetCacheArgs, DataOrError, InstanceArgs, ListenersFunction, Rect, Size, TextInstance, TextInstanceObject, TextRectArgs } from '@moviemasher/shared-lib/types.js'
import type { ClientTextAsset, ClientTextAssetObject, ClientTextInstance } from '../../types.js'


import { TextAssetMixin, TextInstanceMixin } from '@moviemasher/shared-lib/mixin/text.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { $IMAGE, $RECT, $TEXT, CURRENT_COLOR, MOVIEMASHER, RECT_ZERO, TEXT_HEIGHT, isAssetObject, isDefiniteError } from '@moviemasher/shared-lib/runtime.js'
import { containSize, rectTransformAttribute } from '@moviemasher/shared-lib/utility/rect.js'
import { svgSvgElement, svgText } from '@moviemasher/shared-lib/utility/svg.js'
import { ClientInstanceClass } from '../../base/ClientInstanceClass.js'
import { ClientVisibleAssetMixin, ClientVisibleInstanceMixin } from '../../mixin/visible.js'
import { centerPoint } from '../../runtime.js'
import { EventAsset } from '../../utility/events.js'
import { ClientRawAssetClass } from '../../base/ClientRawAssetClass.js'

const WithAsset = VisibleAssetMixin(ClientRawAssetClass)
const WithClientAsset = ClientVisibleAssetMixin(WithAsset)
const WithTextAsset = TextAssetMixin(WithClientAsset)
export class ClientTextAssetClass extends WithTextAsset implements ClientTextAsset {
  constructor(args: ClientTextAssetObject) {
    super(args)
    this.initializeProperties(args)
  }

  override assetIcon(size: Size, _cover?: boolean): Promise<DataOrError<Element>> {
    const args: AssetCacheArgs = { visible: true }
    return this.assetCachePromise(args).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { string, family, textRect } = this
      const containedSize = containSize(textRect, size)
      const outRect = { ...containedSize, ...centerPoint(size, containedSize) }
      const transform = rectTransformAttribute(textRect, outRect)
      const textElement = svgText(string, CURRENT_COLOR, TEXT_HEIGHT, family, transform)
      return { data: svgSvgElement(size, textElement) }
    })
  }

  // override initializeProperties(object: ClientTextAssetObject): void {
  //   const { loadedFont } = object
  //   if (loadedFont) this.loadedFont = loadedFont
  //   super.initializeProperties(object)
  // }
  
  override instanceFromObject(object?: TextInstanceObject): TextInstance {
    const args = this.instanceArgs(object)
    return new ClientTextInstanceClass(args)
  }

  protected _textRect?: Rect

  private get textRect(): Rect { 
    return this._textRect ||= this.textRectInitialize()
  }

  private textRectInitialize(): Rect {
    const { family, string: text } = this

    const args: TextRectArgs = { text, family, size: TEXT_HEIGHT }
    const orError = MOVIEMASHER.call<Rect>($TEXT, $RECT, args)
    if (isDefiniteError(orError)) return RECT_ZERO

    return orError.data
  }

  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, $IMAGE, $TEXT)) {
      detail.asset = new ClientTextAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
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
}



// listen for image/text asset event
export const ClientTextImageListeners: ListenersFunction = () => ({
  [EventAsset.Type]: ClientTextAssetClass.handleAsset
})
