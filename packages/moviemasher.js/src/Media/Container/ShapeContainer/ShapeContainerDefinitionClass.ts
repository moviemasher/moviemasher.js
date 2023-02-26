import { UnknownRecord } from "../../../declarations"
import { ContainerDefinitionMixin } from "../ContainerDefinitionMixin"
import { ShapeContainerClass } from "./ShapeContainerClass"
import {
  ShapeContainer, ShapeContainerDefinition,
  ShapeContainerDefinitionObject, ShapeContainerObject
} from "./ShapeContainer"
import { TweenableDefinitionMixin } from "../../../Mixin/Tweenable/TweenableDefinitionMixin"
import { isAboveZero, isPopulatedString } from "../../../Utility/Is"
import { svgSvgElement, svgPathElement, svgPolygonElement, svgSetTransformRects } from "../../../Helpers/Svg/SvgFunctions"
import { Size, sizeAboveZero, sizeCover } from "../../../Utility/Size"
import { centerPoint } from "../../../Utility/Rect"
import { DefaultContainerId } from "../Container"
import { MediaBase } from "../../MediaBase"
import { ImageType } from "../../../Setup/Enums"

const ShapeContainerDefinitionWithTweenable = TweenableDefinitionMixin(MediaBase)
const ShapeContainerDefinitionWithContainer = ContainerDefinitionMixin(ShapeContainerDefinitionWithTweenable)
export class ShapeContainerDefinitionClass extends ShapeContainerDefinitionWithContainer implements ShapeContainerDefinition {
  constructor(...args: any[]) {
    const [object] = args
    
    super(object)
    
    const { path, pathHeight, pathWidth } = object as ShapeContainerDefinitionObject
    if (path) this.path = path
    if (isAboveZero(pathWidth)) this.pathWidth = pathWidth
    if (isAboveZero(pathHeight)) this.pathHeight = pathHeight
  }

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

  instanceFromObject(object: ShapeContainerObject = {}): ShapeContainer {
    return new ShapeContainerClass(this.instanceArgs(object))
  }

  isVector = true

  path = ""

  pathHeight = 0

  pathWidth = 0

  toJSON(): UnknownRecord {
    const object = super.toJSON()
    if (this.path) object.path = this.path
    if (isAboveZero(this.pathHeight)) object.pathHeight = this.pathHeight
    if (isAboveZero(this.pathWidth)) object.pathWidth = this.pathWidth
    return object
  }

  type = ImageType 
}
