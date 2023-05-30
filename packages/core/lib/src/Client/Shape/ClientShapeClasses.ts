import type {Rect, Size, Time, } from '@moviemasher/runtime-shared'
import type {
  ShapeInstance, ShapeAsset, ShapeInstanceObject
} from '../../Shared/Shape/ShapeTypes.js'
import type { ClientAsset } from "../ClientTypes.js"
import type { AssetEventDetail } from '../../declarations.js'
import type { Component, InstanceCacheArgs } from '../../Base/Code.js'
import type { IntrinsicOptions } from '../../Shared/Mash/Clip/Clip.js'


import { MovieMasher } from '@moviemasher/runtime-client'

import {isPopulatedString} from '../../Shared/SharedGuards.js'
import {svgSvgElement, svgPathElement, svgPolygonElement, svgSetTransformRects} from '../../Helpers/Svg/SvgFunctions.js'
import { sizeAboveZero, sizeCover } from "../../Utility/SizeFunctions.js"
import { centerPoint } from "../../Utility/RectFunctions.js"
import {DefaultContainerId} from '../../Helpers/Container/ContainerConstants.js'
import { VisibleAssetMixin } from '../../Shared/Visible/VisibleAssetMixin.js'
import { ClientVisibleAssetMixin } from "../Visible/ClientVisibleAssetMixin.js"
import { ShapeAssetMixin, ShapeInstanceMixin } from '../../Shared/Shape/ShapeMixins.js'
import { VisibleInstanceMixin } from '../../Shared/Visible/VisibleInstanceMixin.js'
import { ClientVisibleInstanceMixin } from '../Visible/ClientVisibleInstanceMixin.js'
import { ClientInstanceClass } from '../Instance/ClientInstanceClass.js'
import { PointZero } from '../../Utility/PointConstants.js'
import { SvgItem } from '../../Helpers/Svg/Svg.js'
import { ClientAssetClass } from '../Asset/ClientAssetClass.js'
import { isShapeAssetObject } from '../../Shared/Shape/ShapeGuards.js'


const WithAsset = VisibleAssetMixin(ClientAssetClass)
const WithClientAsset = ClientVisibleAssetMixin(WithAsset)
const WithShapeAsset = ShapeAssetMixin(WithClientAsset)

export class ClientShapeAssetClass extends WithShapeAsset implements ShapeAsset {
  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
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

  instanceFromObject(object?: ShapeInstanceObject): ShapeInstance {
    const args = this.instanceArgs(object)
    return new ClientShapeInstanceClass(args)
  }
}

// listen for image/shape asset event
MovieMasher.addDispatchListener<AssetEventDetail>('asset', event => {
  const { detail } = event
  const { assetObject, asset } = detail
  if (!asset && isShapeAssetObject(assetObject)) {
    // console.log('ClientShapeAsset AssetEvent setting asset', assetObject)
    detail.asset = new ClientShapeAssetClass(assetObject)
    // console.log('ClientShapeAsset AssetEvent set asset', detail.asset?.label)
    event.stopImmediatePropagation()
  } 
})

const WithInstance = VisibleInstanceMixin(ClientInstanceClass)
const WithClientInstance = ClientVisibleInstanceMixin(WithInstance)
const WithShapeInstance = ShapeInstanceMixin(WithClientInstance)

export class ClientShapeInstanceClass extends WithShapeInstance implements ShapeInstance {
  declare asset: ShapeAsset & ClientAsset

  containerSvgItemPromise(containerRect: Rect, time: Time, component: Component): Promise<SvgItem> {
    return Promise.resolve(this.pathElement(containerRect))
  }

  intrinsicRect(editing = false): Rect {
    const { pathHeight: height, pathWidth: width} = this.asset
    // console.log(this.constructor.name, 'intrinsicRect', this.definition)
    return { width, height, ...PointZero }
  }

  intrinsicsKnown(options: IntrinsicOptions): boolean {
    return true
  }

  instanceCachePromise(args: InstanceCacheArgs): Promise<void> {
    return Promise.resolve()
  }

  pathElement(rect: Rect, forecolor = ''): SvgItem {
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


