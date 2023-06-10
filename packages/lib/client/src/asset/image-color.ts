import { AssetEventDetail, AssetManager, ClientAsset, ClientAssetClass, ClientColorAsset, ClientColorInstance, ClientInstanceClass, ClientVisibleAssetMixin, ClientVisibleInstanceMixin, ColorAsset, ColorAssetMixin, ColorInstance, ColorInstanceMixin, ColorInstanceObject, Panel, SvgItem, VisibleAssetMixin, VisibleInstanceMixin, centerPoint, isAssetObject, sizeCover, svgPathElement, svgPolygonElement, svgSetTransformRects, svgSvgElement } from '@moviemasher/lib-shared'

import { DefaultContentId } from '@moviemasher/lib-shared'
import { MovieMasher } from '@moviemasher/runtime-client'
import { Rect, Size, SourceColor, Time, TypeImage } from '@moviemasher/runtime-shared'

const ColorContentIcon = 'M136.5 77.7l37 67L32 285.7 216.4 464l152.4-148.6 54.4-11.4L166.4 48l-29.9 29.7zm184 208H114.9l102.8-102.3 102.8 102.3zM423.3 304s-56.7 61.5-56.7 92.1c0 30.7 25.4 55.5 56.7 55.5 31.3 0 56.7-24.9 56.7-55.5S423.3 304 423.3 304z'
const ColorContentSize = 512

const WithAsset = VisibleAssetMixin(ClientAssetClass)
const WithClientAsset = ClientVisibleAssetMixin(WithAsset)
const WithColorAsset = ColorAssetMixin(WithClientAsset)

export class ClientColorAssetClass extends WithColorAsset implements ClientColorAsset {
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
}

const WithInstance = VisibleInstanceMixin(ClientInstanceClass)
const WithClientInstance = ClientVisibleInstanceMixin(WithInstance)
const WithColorInstance = ColorInstanceMixin(WithClientInstance)

export class ClientColorInstanceClass extends WithColorInstance implements ClientColorInstance {
  declare asset: ColorAsset & ClientAsset

  override contentPreviewItemPromise(containerRect: Rect, time: Time, _component: Panel): Promise<SvgItem> {
    const range = this.clip.timeRange

    const rect = this.itemContentRect(containerRect, time)
    const { colorFilter } = this
    const [color] = this.tweenValues('color', time, range)
    const { x, y, width, height } = rect
    colorFilter.setValues({ width, height, color })
    const [svg] = colorFilter.filterSvgs()
    svg.setAttribute('x', String(x))
    svg.setAttribute('y', String(y))
    return Promise.resolve(svg)
  }

  override pathElement(rect: Rect, forecolor = 'none'): SvgItem {
    return svgPolygonElement(rect, '', forecolor)
  }
}

// predefine default image/color asset
(MovieMasher.assetManager as AssetManager).predefine(DefaultContentId, new ClientColorAssetClass({ 
  id: DefaultContentId, type: TypeImage, source: SourceColor, label: 'Color',
}))

// listen for image/color asset event
MovieMasher.eventDispatcher.addDispatchListener<AssetEventDetail>('asset', event => {
  const { detail } = event
  const { assetObject, asset } = detail
  if (!asset && isAssetObject(assetObject, TypeImage, SourceColor)) {
    detail.asset = new ClientColorAssetClass(assetObject)
    event.stopImmediatePropagation()
  }
})
