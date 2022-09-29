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
import { isUndefined } from "../../Utility"
const TextContainerDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase)
const TextContainerDefinitionWithContainer = ContainerDefinitionMixin(TextContainerDefinitionWithTweenable)
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

  instanceArgs(object?: TextContainerObject): TextContainerObject {
    const textObject = object || {}
    if (isUndefined(textObject.lock)) textObject.lock = Orientation.V
    return super.instanceArgs(textObject)
  }
  
  instanceFromObject(object: TextContainerObject = {}): TextContainer {
    return new TextContainerClass(this.instanceArgs(object))
  }
}
