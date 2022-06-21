import { DefinitionType } from "../../Setup/Enums"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { ContainerDefinitionMixin } from "../ContainerDefinitionMixin"
import { TextContainerClass } from "./TextContainerClass"
import {
  TextContainer, TextContainerDefinition,
  TextContainerObject
} from "./TextContainer"
import { FilterDefinition } from "../../Filter/Filter"
import { filterDefinitionFromId } from "../../Filter/FilterFactory"

const TextContainerMixin = ContainerDefinitionMixin(DefinitionBase)
export class TextContainerDefinitionClass extends TextContainerMixin implements TextContainerDefinition {
  constructor(...args: any[]) {
    super(...args)
    this.textFilterDefinition = filterDefinitionFromId('text')
    this.setptsFilterDefinition = filterDefinitionFromId('setpts')
    this.alphaColorFilterDefinition = filterDefinitionFromId('alphacolor')
    this.properties.push(...this.textFilterDefinition.properties)
  }

  alphaColorFilterDefinition: FilterDefinition

  instanceFromObject(object: TextContainerObject = {}): TextContainer {
    return new TextContainerClass(this.instanceArgs(object))
  }

  setptsFilterDefinition: FilterDefinition

  textFilterDefinition: FilterDefinition

  type = DefinitionType.TextContainer
}
