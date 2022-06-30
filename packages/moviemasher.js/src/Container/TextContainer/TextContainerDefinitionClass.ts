import { DataType, DefinitionType } from "../../Setup/Enums"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { ContainerDefinitionMixin } from "../ContainerDefinitionMixin"
import { TextContainerClass } from "./TextContainerClass"
import {
  TextContainer, TextContainerDefinition,
  TextContainerObject
} from "./TextContainer"
import { propertyInstance } from "../../Setup/Property"
import { fontDefault } from "../../Media/Font/FontFactory"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
const TextContainerDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase)
const TextContainerDefinitionWithContainer = ContainerDefinitionMixin(TextContainerDefinitionWithTweenable)
export class TextContainerDefinitionClass extends TextContainerDefinitionWithContainer implements TextContainerDefinition {
  instanceFromObject(object: TextContainerObject = {}): TextContainer {
    return new TextContainerClass(this.instanceArgs(object))
  }

  type = DefinitionType.TextContainer
}
