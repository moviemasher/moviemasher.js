import type { ClientAsset, ClientColorAsset, ClientColorInstance, Panel, SvgItem } from '@moviemasher/runtime-client'
import type { ColorAsset, ColorAssetObject, ColorInstance, ColorInstanceObject, InstanceArgs, ListenersFunction, PropertySize, Rect, Size, Time, Value } from '@moviemasher/runtime-shared'

import { ColorAssetMixin, VisibleAssetMixin, } from '@moviemasher/lib-shared/asset/mixins.js'
import { ColorInstanceMixin, VisibleInstanceMixin, } from '@moviemasher/lib-shared/instance/mixins.js'
import { assertPopulatedString } from '@moviemasher/lib-shared/utility/guards.js'
import { centerPoint, sizeCover } from '@moviemasher/lib-shared/utility/rect.js'
import { EventAsset } from '@moviemasher/runtime-client'
import { COLOR, DEFAULT_CONTENT_ID, HEIGHT, IMAGE, NAMESPACE_SVG, NONE, WIDTH, isAssetObject } from '@moviemasher/runtime-shared'
import { svgPathElement, svgPolygonElement, svgSetTransformRects, svgSvgElement } from '../../utility/svg.js'
import { ClientVisibleAssetMixin } from '../../mixins/ClientVisibleAssetMixin.js'
import { ClientVisibleInstanceMixin } from '../../mixins/ClientVisibleInstanceMixin.js'
import { ClientInstanceClass } from '../../instance/ClientInstanceClass.js'
import { ClientAssetClass } from '../ClientAssetClass.js'

const ColorContentIcon = 'M136.5 77.7l37 67L32 285.7 216.4 464l152.4-148.6 54.4-11.4L166.4 48l-29.9 29.7zm184 208H114.9l102.8-102.3 102.8 102.3zM423.3 304s-56.7 61.5-56.7 92.1c0 30.7 25.4 55.5 56.7 55.5 31.3 0 56.7-24.9 56.7-55.5S423.3 304 423.3 304z'
const ColorContentSize = 512

const pixelColor = (value : Value) : string => {
  const string = String(value)
  if (string.slice(0, 2) === '0x') return `#${string.slice(2)}`

  return string
}

const WithAsset = VisibleAssetMixin(ClientAssetClass)
const WithClientAsset = ClientVisibleAssetMixin(WithAsset)
const WithColorAsset = ColorAssetMixin(WithClientAsset)
export class ClientColorAssetClass extends WithColorAsset implements ClientColorAsset {
  constructor(args: ColorAssetObject) {
    super(args)
    this.initializeProperties(args)
  }
  
  override assetIcon(size: Size, cover?: boolean): Promise<SVGSVGElement> | undefined {
    const inSize = { width: ColorContentSize, height: ColorContentSize }
    const coverSize = sizeCover(inSize, size, !cover)
    const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
    const pathElement = svgPathElement(ColorContentIcon)
    svgSetTransformRects(pathElement, inSize, outRect)
    return Promise.resolve(svgSvgElement(size, pathElement))
  }

  override instanceFromObject(object?: ColorInstanceObject): ColorInstance {
    const args = this.instanceArgs(object)
    return new ClientColorInstanceClass(args)
  }

  private static _defaultAsset?: ClientColorAsset
  private static get defaultAsset(): ClientColorAsset {
    return this._defaultAsset ||= new ClientColorAssetClass({ 
      id: DEFAULT_CONTENT_ID, type: IMAGE, source: COLOR, label: 'Color',
    })
  }

  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject, assetId } = detail
    
    const isDefault = assetId === DEFAULT_CONTENT_ID
    if (!(isDefault || isAssetObject(assetObject, IMAGE, COLOR))) return
      
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

  override contentPreviewItemPromise(rect: Rect, _shortest: PropertySize, time: Time, _component: Panel): Promise<SvgItem> {

    const range = this.clip.timeRange

    const { x, y, width, height } = rect
    const [color] = this.tweenValues('color', time, range)
    assertPopulatedString(color)

    const svg = globalThis.document.createElementNS(NAMESPACE_SVG, 'rect')
    svg.setAttribute(WIDTH, String(width))
    svg.setAttribute(HEIGHT, String(height))
    svg.setAttribute('fill', pixelColor(color))
    svg.setAttribute('x', String(x))
    svg.setAttribute('y', String(y))
    return Promise.resolve(svg)
  }

  override pathElement(rect: Rect, forecolor = NONE): SvgItem {
    return svgPolygonElement(rect, '', forecolor)
  }
}
