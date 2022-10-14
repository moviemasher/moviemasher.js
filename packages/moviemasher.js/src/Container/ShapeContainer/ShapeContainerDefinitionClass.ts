import { UnknownObject } from "../../declarations"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { ContainerDefinitionMixin } from "../ContainerDefinitionMixin"
import { ShapeContainerClass } from "./ShapeContainerClass"
import {
  ShapeContainer, ShapeContainerDefinition,
  ShapeContainerDefinitionObject, ShapeContainerObject
} from "./ShapeContainer"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { isAboveZero, isPopulatedString } from "../../Utility/Is"
import { svgElement, svgPathElement, svgPolygonElement, svgSetTransformRects } from "../../Utility/Svg"
import { Size, sizeAboveZero, sizeCover } from "../../Utility/Size"
import { Loader } from "../../Loader/Loader"
import { centerPoint } from "../../Utility/Rect"
import { DefaultContainerId } from "../Container"

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

  definitionIcon(loader: Loader, size: Size): Promise<SVGSVGElement> | undefined {
    const superElement = super.definitionIcon(loader, size)
    if (superElement) return superElement

    const { id, pathHeight: height, pathWidth: width, path } = this
    if (id === DefaultContainerId) {
      return Promise.resolve(svgElement(size, svgPolygonElement(size, '', 'currentColor')))
    }
    const inSize = { width, height }
    if (!(sizeAboveZero(inSize) && isPopulatedString(path))) return

    const coverSize = sizeCover(inSize, size, true)
    const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
    const pathElement = svgPathElement(path)
    svgSetTransformRects(pathElement, inSize, outRect)
    return Promise.resolve(svgElement(size, pathElement))
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
}
