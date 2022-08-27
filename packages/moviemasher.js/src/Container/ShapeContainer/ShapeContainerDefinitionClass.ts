import { Endpoint, LoadedImage, SvgOrImage, UnknownObject } from "../../declarations"
import { DefinitionType } from "../../Setup/Enums"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { ContainerDefinitionMixin } from "../ContainerDefinitionMixin"
import { ShapeContainerClass } from "./ShapeContainerClass"
import {
  ShapeContainer, ShapeContainerDefinition,
  ShapeContainerDefinitionObject, ShapeContainerObject
} from "./ShapeContainer"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { isAboveZero, isPopulatedString } from "../../Utility/Is"
import { svgElement, svgPathElement, svgPolygonElement } from "../../Utility/Svg"
import { PointZero } from "../../Utility/Point"
import { Size, sizeAboveZero, sizeCover } from "../../Utility/Size"
import { tweenRectTransform, tweenScaleSizeRatioLock} from "../../Utility/Tween"

const ShapeContainerDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase)
const ShapeContainerDefinitionWithContainer = ContainerDefinitionMixin(ShapeContainerDefinitionWithTweenable)
export class ShapeContainerDefinitionClass extends ShapeContainerDefinitionWithContainer implements ShapeContainerDefinition {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    const { path, pathHeight, pathWidth } = object as ShapeContainerDefinitionObject
    if (path) this.path = path
    if (isAboveZero(pathWidth)) this.pathWidth = pathWidth
    if (isAboveZero(pathHeight)) this.pathHeight = pathHeight
  }

  definitionIcon(endpoint: Endpoint, size: Size): Promise<SvgOrImage> | undefined {
    const superElement = super.definitionIcon(endpoint, size)
    if (superElement) return superElement

    const { pathHeight: height, pathWidth: width, path} = this
    const mySize = { width, height }
    if (!(sizeAboveZero(mySize) && isPopulatedString(path))) return

    const wantSize = sizeCover(mySize, size, true)

    const myRect = { ...PointZero, ...mySize }
    const wantRect = { ...PointZero, ...wantSize }
    wantRect.x = (size.width - wantRect.width) / 2
    
    const transformAttribute = tweenRectTransform(myRect, wantRect)
    const pathElement = svgPathElement(path)
    pathElement.setAttribute('transform', transformAttribute)
    pathElement.setAttribute('transform-origin', 'top left')

    const svg = svgElement(size)
    svg.appendChild(svgPolygonElement(wantRect, '', 'none'))
    svg.appendChild(pathElement)
    
    return Promise.resolve(svg)
  }

  instanceFromObject(object: ShapeContainerObject = {}): ShapeContainer {
    return new ShapeContainerClass(this.instanceArgs(object))
  }

  path = ""

  pathHeight = 0

  pathWidth = 0

  toJSON(): UnknownObject {
    const object = super.toJSON()
    if (this.path) object.path = this.path
    if (isAboveZero(this.pathHeight)) object.pathHeight = this.pathHeight
    if (isAboveZero(this.pathWidth)) object.pathWidth = this.pathWidth
    return object
  }

  type = DefinitionType.Container
}
