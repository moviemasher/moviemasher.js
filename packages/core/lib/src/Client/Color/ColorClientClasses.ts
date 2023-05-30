import type {Rect, Size, Time, TimeRange} from '@moviemasher/runtime-shared'
import type {
  ColorInstance, ColorAsset,
  ColorInstanceObject
} from '../../Shared/Color/ColorTypes.js'

import {svgSvgElement, svgPathElement, svgSetTransformRects, svgPolygonElement} from '../../Helpers/Svg/SvgFunctions.js'
import { sizeCover } from "../../Utility/SizeFunctions.js"
import { centerPoint } from "../../Utility/RectFunctions.js"
import { VisibleAssetMixin } from '../../Shared/Visible/VisibleAssetMixin.js'
import { ClientVisibleAssetMixin } from "../Visible/ClientVisibleAssetMixin.js"
import { ColorAssetMixin, ColorInstanceMixin } from '../../Shared/Color/ColorMixins.js'
import { VisibleInstanceMixin } from '../../Shared/Visible/VisibleInstanceMixin.js'
import { ClientVisibleInstanceMixin } from '../Visible/ClientVisibleInstanceMixin.js'
import { ClientInstanceClass } from '../Instance/ClientInstanceClass.js'
import { ClientAsset } from "../ClientTypes.js"
import { SvgItem } from '../../Helpers/Svg/Svg.js'
import { Component } from '../../Base/Code.js'
import { ClientAssetClass } from '../Asset/ClientAssetClass.js'

const ColorContentIcon = 'M136.5 77.7l37 67L32 285.7 216.4 464l152.4-148.6 54.4-11.4L166.4 48l-29.9 29.7zm184 208H114.9l102.8-102.3 102.8 102.3zM423.3 304s-56.7 61.5-56.7 92.1c0 30.7 25.4 55.5 56.7 55.5 31.3 0 56.7-24.9 56.7-55.5S423.3 304 423.3 304z'
const ColorContentSize = 512

const WithAsset = VisibleAssetMixin(ClientAssetClass)
const WithClientAsset = ClientVisibleAssetMixin(WithAsset)
const WithColorAsset = ColorAssetMixin(WithClientAsset)

export class ColorClientAssetClass extends WithColorAsset implements ColorAsset {
  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    const inSize = { width: ColorContentSize, height: ColorContentSize }
    const coverSize = sizeCover(inSize, size, true)
    const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
    const pathElement = svgPathElement(ColorContentIcon)
    svgSetTransformRects(pathElement, inSize, outRect)
    return Promise.resolve(svgSvgElement(size, pathElement))
  }

  instanceFromObject(object?: ColorInstanceObject): ColorInstance {
    const args = this.instanceArgs(object)
    return new ClientColorInstanceClass(args)
  }
}

const WithInstance = VisibleInstanceMixin(ClientInstanceClass)
const WithClientInstance = ClientVisibleInstanceMixin(WithInstance)
const WithColorInstance = ColorInstanceMixin(WithClientInstance)

export class ClientColorInstanceClass extends WithColorInstance implements ColorInstance {
  declare asset: ColorAsset & ClientAsset

  contentPreviewItemPromise(containerRect: Rect, time: Time, component: Component): Promise<SvgItem> {
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

  pathElement(rect: Rect, forecolor = 'none'): SvgItem {
    return svgPolygonElement(rect, '', forecolor)
  }
}
