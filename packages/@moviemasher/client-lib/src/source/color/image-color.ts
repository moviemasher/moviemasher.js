import type { ClientAsset, ClientColorAsset, ClientColorInstance } from '../../types.js'
import type { ColorAsset, ColorAssetObject, ColorInstance, ColorInstanceObject, DataOrError, InstanceArgs, ListenersFunction, Size } from '@moviemasher/shared-lib/types.js'

import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'

import { coverSize } from '@moviemasher/shared-lib/utility/rect.js'
import { centerPoint } from '../../runtime.js'

import { EventAsset } from '../../utility/events.js'
import { $COLOR, DEFAULT_CONTENT_ID, $IMAGE, isAssetObject } from '@moviemasher/shared-lib/runtime.js'
import { ClientVisibleAssetMixin } from '../../mixin/visible.js'
import { ClientVisibleInstanceMixin } from '../../mixin/visible.js'
import { ClientInstanceClass } from '../../base/ClientInstanceClass.js'
import { ClientAssetClass } from '../../base/ClientAssetClass.js'
import { svgPathElement, svgSetTransformRects, svgSvgElement } from '@moviemasher/shared-lib/utility/svg.js'
import { ColorAssetMixin, ColorInstanceMixin } from '@moviemasher/shared-lib/mixin/color.js'

const ColorContentIcon = 'M136.5 77.7l37 67L32 285.7 216.4 464l152.4-148.6 54.4-11.4L166.4 48l-29.9 29.7zm184 208H114.9l102.8-102.3 102.8 102.3zM423.3 304s-56.7 61.5-56.7 92.1c0 30.7 25.4 55.5 56.7 55.5 31.3 0 56.7-24.9 56.7-55.5S423.3 304 423.3 304z'
const ColorContentSize = 512

const WithAsset = VisibleAssetMixin(ClientAssetClass)
const WithClientAsset = ClientVisibleAssetMixin(WithAsset)
const WithColorAsset = ColorAssetMixin(WithClientAsset)
export class ClientColorAssetClass extends WithColorAsset implements ClientColorAsset {
  constructor(args: ColorAssetObject) {
    super(args)
    this.initializeProperties(args)
  }
  
  override assetIcon(size: Size, cover?: boolean): Promise<DataOrError<Element>> {
    const inSize = { width: ColorContentSize, height: ColorContentSize }
    const coveredSize = coverSize(inSize, size, !cover)
    const outRect = { ...coveredSize, ...centerPoint(size, coveredSize) }
    const element = svgPathElement(ColorContentIcon)
    svgSetTransformRects(element, inSize, outRect)
    return Promise.resolve({ data: svgSvgElement(size, element) })
  }

  override instanceFromObject(object?: ColorInstanceObject): ColorInstance {
    const args = this.instanceArgs(object)
    return new ClientColorInstanceClass(args)
  }

  private static _defaultAsset?: ClientColorAsset
  private static get defaultAsset(): ClientColorAsset {
    return this._defaultAsset ||= new ClientColorAssetClass({ 
      id: DEFAULT_CONTENT_ID, type: $IMAGE, source: $COLOR, label: 'Color',
    })
  }

  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject, assetId } = detail
    
    const isDefault = assetId === DEFAULT_CONTENT_ID
    if (!(isDefault || isAssetObject(assetObject, $IMAGE, $COLOR))) return
      
    event.stopImmediatePropagation()
    if (isDefault) detail.asset = ClientColorAssetClass.defaultAsset
    else detail.asset = new ClientColorAssetClass(assetObject as ColorAssetObject) 
  }
}

// listen for image/color asset event
export const colorClientListeners: ListenersFunction = () => ({ 
  [EventAsset.Type]: ClientColorAssetClass.handleAsset 
})

const WithInstance = VisibleInstanceMixin(ClientInstanceClass)
const WithClientInstance = ClientVisibleInstanceMixin(WithInstance)
const WithColorInstance = ColorInstanceMixin(WithClientInstance)
export class ClientColorInstanceClass extends WithColorInstance implements ClientColorInstance {
  constructor(args: ColorInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }

  declare asset: ColorAsset & ClientAsset

}
