import type { ClientAsset, ClientColorAsset, ClientColorInstance, Panel, SvgItem } from '@moviemasher/runtime-client'
import type { ColorAsset, ColorAssetObject, ColorInstance, ColorInstanceObject, InstanceArgs, PropertySize, Rect, Size, Time, Value } from '@moviemasher/runtime-shared'

import { EventAsset, MovieMasher } from '@moviemasher/runtime-client'
import { isAssetObject, SourceColor, TypeImage } from '@moviemasher/runtime-shared'

import { assertPopulatedString, centerPoint, ClientAssetClass, ClientInstanceClass, ClientVisibleAssetMixin, ClientVisibleInstanceMixin, ColorAssetMixin, ColorInstanceMixin, DefaultContentId, NamespaceSvg, sizeCover, svgPathElement, svgPolygonElement, svgSetTransformRects, svgSvgElement, VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/lib-shared'

const ColorContentIcon = 'M136.5 77.7l37 67L32 285.7 216.4 464l152.4-148.6 54.4-11.4L166.4 48l-29.9 29.7zm184 208H114.9l102.8-102.3 102.8 102.3zM423.3 304s-56.7 61.5-56.7 92.1c0 30.7 25.4 55.5 56.7 55.5 31.3 0 56.7-24.9 56.7-55.5S423.3 304 423.3 304z'
const ColorContentSize = 512

const WithAsset = VisibleAssetMixin(ClientAssetClass)
const WithClientAsset = ClientVisibleAssetMixin(WithAsset)
const WithColorAsset = ColorAssetMixin(WithClientAsset)

const pixelColor = (value : Value) : string => {
  const string = String(value)
  if (string.slice(0, 2) === '0x') return `#${string.slice(2)}`

  return string
}


export class ClientColorAssetClass extends WithColorAsset implements ClientColorAsset {
  constructor(args: ColorAssetObject) {
    super(args)
    this.initializeProperties(args)
  }
  
  override definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    const inSize = { width: ColorContentSize, height: ColorContentSize }
    const coverSize = sizeCover(inSize, size, true)
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
      id: DefaultContentId, type: TypeImage, source: SourceColor, label: 'Color',
    })
  }

  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject, assetId } = detail
    
    const isDefault = assetId === DefaultContentId
    if (!(isDefault || isAssetObject(assetObject, TypeImage, SourceColor))) return
      
    event.stopImmediatePropagation()
    if (isDefault) detail.asset = ClientColorAssetClass.defaultAsset
    else detail.asset = new ClientColorAssetClass(assetObject as ColorAssetObject) 
  }
}

// listen for image/color asset event
MovieMasher.eventDispatcher.addDispatchListener(
  EventAsset.Type, ClientColorAssetClass.handleAsset
)

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

    const svg = globalThis.document.createElementNS(NamespaceSvg, 'rect')
    svg.setAttribute('width', String(width))
    svg.setAttribute('height', String(height))
    svg.setAttribute('fill', pixelColor(color))
    svg.setAttribute('x', String(x))
    svg.setAttribute('y', String(y))
    return Promise.resolve(svg)
  }

  override pathElement(rect: Rect, forecolor = 'none'): SvgItem {
    return svgPolygonElement(rect, '', forecolor)
  }
}
