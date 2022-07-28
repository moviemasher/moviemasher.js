import { DataType, DefinitionType } from "../../Setup/Enums"
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
const TextContainerDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase)
const TextContainerDefinitionWithContainer = ContainerDefinitionMixin(TextContainerDefinitionWithTweenable)
export class TextContainerDefinitionClass extends TextContainerDefinitionWithContainer implements TextContainerDefinition {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args

    this.properties.push(propertyInstance({
      custom: true, type: DataType.String, defaultValue: 'Text'
    }))
    this.properties.push(propertyInstance({
      custom: true, type: DataType.FontId, name: 'fontId', 
      defaultValue: fontDefault.id
    }))
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, type: DataType.Percent, 
      name: 'height', defaultValue: 0.3, max: 2.0, group: DataGroup.Size
    }))

    this.properties.push(propertyInstance({
      tweenable: true, custom: true, type: DataType.Percent, 
      name: 'width', defaultValue: 0.3, max: 2.0, group: DataGroup.Size
    }))
    // console.log(this.constructor.name, "lock", this.lock)
  }
  
  instanceFromObject(object: TextContainerObject = {}): TextContainer {
    return new TextContainerClass(this.instanceArgs(object))
  }

  type = DefinitionType.Container
}
