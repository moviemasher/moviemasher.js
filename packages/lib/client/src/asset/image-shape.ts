import type { 
  Rect, InstanceCacheArgs, 
  Size, AssetEventDetail, Time, ShapeInstance, ShapeInstanceObject, 
} from '@moviemasher/runtime-shared'
import type { 
  SvgItem, 
} from '@moviemasher/lib-shared'
import { 
  ClientVisibleAssetMixin, ClientVisibleInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin, 
  centerPoint, 
  sizeCover, 
  svgSvgElement,
  ClientInstanceClass, 
} from '@moviemasher/lib-shared'

import { MovieMasher } from '@moviemasher/runtime-client'
import {
  isPopulatedString, isAssetObject, SourceShape, TypeImage
} from '@moviemasher/runtime-shared'


import { 
  ClientShapeAsset, 
  ClientShapeInstance, 
  Panel, 
} from '@moviemasher/lib-shared'
import { 
  ClientAssetClass, 
  ShapeAssetMixin, ShapeInstanceMixin, 
  sizeAboveZero, svgPathElement, svgPolygonElement, 
  svgSetTransformRects, DefaultContainerId 
} from '@moviemasher/lib-shared'


const WithAsset = VisibleAssetMixin(ClientAssetClass)
const WithClientAsset = ClientVisibleAssetMixin(WithAsset)
const WithShapeAsset = ShapeAssetMixin(WithClientAsset)

export class ClientShapeAssetClass extends WithShapeAsset implements ClientShapeAsset {
  override definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    const { id, pathHeight: height, pathWidth: width, path } = this
    if (id === DefaultContainerId) {
      return Promise.resolve(svgSvgElement(size, svgPolygonElement(size, '', 'currentColor')))
    }
    const inSize = { width, height }
    if (!(sizeAboveZero(inSize) && isPopulatedString(path))) return

    const coverSize = sizeCover(inSize, size, true)
    const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
    const pathElement = svgPathElement(path)
    svgSetTransformRects(pathElement, inSize, outRect)
    return Promise.resolve(svgSvgElement(size, pathElement))
  }

  override instanceFromObject(object?: ShapeInstanceObject): ShapeInstance {
    const args = this.instanceArgs(object)
    return new ClientShapeInstanceClass(args)
  }
}

const WithInstance = VisibleInstanceMixin(ClientInstanceClass)
const WithClientInstance = ClientVisibleInstanceMixin(WithInstance)
const WithShapeInstance = ShapeInstanceMixin(WithClientInstance)

export class ClientShapeInstanceClass extends WithShapeInstance implements ClientShapeInstance {
  declare asset: ClientShapeAsset

  override containerSvgItemPromise(containerRect: Rect, _time: Time, _component: Panel): Promise<SvgItem> {
    return Promise.resolve(this.pathElement(containerRect))
  }

  override instanceCachePromise(_args: InstanceCacheArgs): Promise<void> {
    return Promise.resolve()
  }

  override pathElement(rect: Rect, forecolor = ''): SvgItem {
    const inRect = this.intrinsicRect(true)
    if (!sizeAboveZero(inRect)) {
      const polygonElement = svgPolygonElement(rect, '', forecolor)
      return polygonElement
    }
    const { asset } = this
    const { path } = asset
    const pathElement = svgPathElement(path, '')
    svgSetTransformRects(pathElement, inRect, rect)
    return pathElement
  }
}

// predefine default image/shape asset
MovieMasher.assetManager.predefine(DefaultContainerId, new ClientShapeAssetClass({ 
  id: DefaultContainerId, type: TypeImage, source: SourceShape, label: 'Rectangle'
}))

// listen for image/shape asset event
MovieMasher.eventDispatcher.addDispatchListener<AssetEventDetail>('asset', event => {
  const { detail } = event
  const { assetObject, asset } = detail
  if (!asset && isAssetObject(assetObject, TypeImage, SourceShape)) {
    detail.asset = new ClientShapeAssetClass(assetObject)
    event.stopImmediatePropagation()
  }
})
