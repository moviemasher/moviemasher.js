import { ColorContent, ColorContentDefinition, ColorContentDefinitionObject, ColorContentObject } from "./ColorContent"
import { ColorContentClass } from "./ColorContentClass"
import { ContentDefinitionMixin } from "../ContentDefinitionMixin"
import { isPopulatedString } from "../../../Utility/Is"
import { colorBlack } from "../../../Utility/Color"
import { TweenableDefinitionMixin } from "../../../Mixin/Tweenable/TweenableDefinitionMixin"
import { MediaBase } from "../../MediaBase"
import { Size, sizeCover } from "../../../Utility/Size"
import { svgPathElement, svgSetTransformRects, svgSvgElement } from "../../../Utility/Svg"
import { centerPoint } from "../../../Utility/Rect"


const ColorContentIcon = 'M136.5 77.7l37 67L32 285.7 216.4 464l152.4-148.6 54.4-11.4L166.4 48l-29.9 29.7zm184 208H114.9l102.8-102.3 102.8 102.3zM423.3 304s-56.7 61.5-56.7 92.1c0 30.7 25.4 55.5 56.7 55.5 31.3 0 56.7-24.9 56.7-55.5S423.3 304 423.3 304z'
const ColorContentSize = 512

const ColorContentDefinitionWithTweenable = TweenableDefinitionMixin(MediaBase)
const ColorContentDefinitionWithContent = ContentDefinitionMixin(ColorContentDefinitionWithTweenable)
export class ColorContentDefinitionClass extends ColorContentDefinitionWithContent implements ColorContentDefinition {
  constructor(...args: any[]) {
    const [object] = args
    super(object)
    
    const { color } = object as ColorContentDefinitionObject
    if (isPopulatedString(color)) this.color = color
  }

  color = colorBlack


  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    const inSize = { width: ColorContentSize, height: ColorContentSize }
    const coverSize = sizeCover(inSize, size, true)
    const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
    const pathElement = svgPathElement(ColorContentIcon)
    svgSetTransformRects(pathElement, inSize, outRect)
    return Promise.resolve(svgSvgElement(size, pathElement))
  }
  
  instanceFromObject(object: ColorContentObject = {}): ColorContent {
    return new ColorContentClass(this.instanceArgs(object))
  }

}
