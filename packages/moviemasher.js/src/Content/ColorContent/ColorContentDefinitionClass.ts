import { ColorContent, ColorContentDefinition, ColorContentDefinitionObject, ColorContentObject } from "./ColorContent"
import { ColorContentClass } from "./ColorContentClass"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { DefinitionType } from "../../Setup/Enums"
import { filterDefinitionFromId } from "../../Filter/FilterFactory"
import { FilterDefinition } from "../../Filter/Filter"
import { ContentDefinitionMixin } from "../ContentDefinitionMixin"
import { isPopulatedString } from "../../Utility/Is"
import { colorBlack } from "../../Utility/Color"

export class ColorContentDefinitionClass extends ContentDefinitionMixin(DefinitionBase) implements ColorContentDefinition {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    const { color } = object as ColorContentDefinitionObject
    if (isPopulatedString(color)) this.color = color
    this.colorFilterDefinition = filterDefinitionFromId('color')
    this.properties.push(...this.colorFilterDefinition.properties)
  }

  color = colorBlack

  colorFilterDefinition: FilterDefinition

  instanceFromObject(object: ColorContentObject = {}): ColorContent {
    return new ColorContentClass(this.instanceArgs(object))
  }

  type = DefinitionType.ColorContent
}
