import { DataType, DefinitionType, Orientation } from "../../Setup/Enums"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { ContainerDefinitionMixin } from "../ContainerDefinitionMixin"
import { TextContainerClass } from "./TextContainerClass"
import {
  TextContainer, TextContainerDefinition,
  TextContainerObject
} from "./TextContainer"
import { DataGroup, propertyInstance } from "../../Setup/Property"
import { fontDefault } from "../../Media/Font/FontFactory"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { isUndefined } from "../../Utility/Is"
import { Loader } from "../../Loader/Loader"
import { Size, sizeCover } from "../../Utility/Size"
import { svgElement, svgPathElement, svgPolygonElement, svgSetTransformRects } from "../../Utility/Svg"
import { centerPoint } from "../../Utility/Rect"

const TextContainerDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase)
const TextContainerDefinitionWithContainer = ContainerDefinitionMixin(TextContainerDefinitionWithTweenable)
const TextContainerDefinitionIcon = 'M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z'
export class TextContainerDefinitionClass extends TextContainerDefinitionWithContainer implements TextContainerDefinition {
  constructor(...args: any[]) {
    super(...args)

    this.properties.push(propertyInstance({
      name: 'string', custom: true, type: DataType.String, defaultValue: 'Text'
    }))
    this.properties.push(propertyInstance({
      name: 'fontId', custom: true, type: DataType.FontId,  
      defaultValue: fontDefault.id
    }))
    this.properties.push(propertyInstance({
      name: 'height', tweenable: true, custom: true, type: DataType.Percent, 
      defaultValue: 0.3, max: 2.0, group: DataGroup.Size
    }))

    this.properties.push(propertyInstance({
      name: 'width', tweenable: true, custom: true, type: DataType.Percent, 
      defaultValue: 0.8, max: 2.0, group: DataGroup.Size
    }))
  }

  definitionIcon(loader: Loader, size: Size): Promise<SVGSVGElement> | undefined {
    const superElement = super.definitionIcon(loader, size)
    if (superElement) return superElement

    const inSize = { width: 24, height: 24 }
    const coverSize = sizeCover(inSize, size, true)
    const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
    const pathElement = svgPathElement(TextContainerDefinitionIcon)
    svgSetTransformRects(pathElement, inSize, outRect)
    return Promise.resolve(svgElement(size, pathElement))
  }

  instanceArgs(object?: TextContainerObject): TextContainerObject {
    const textObject = object || {}
    if (isUndefined(textObject.lock)) textObject.lock = Orientation.V
    return super.instanceArgs(textObject)
  }
  
  instanceFromObject(object: TextContainerObject = {}): TextContainer {
    return new TextContainerClass(this.instanceArgs(object))
  }
}
