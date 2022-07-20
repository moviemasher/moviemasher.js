import { ColorContent, ColorContentDefinition, ColorContentDefinitionObject, ColorContentObject } from "./ColorContent"
import { ColorContentClass } from "./ColorContentClass"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { DefinitionType } from "../../Setup/Enums"
import { ContentDefinitionMixin } from "../ContentDefinitionMixin"
import { isPopulatedString } from "../../Utility/Is"
import { colorBlack } from "../../Utility/Color"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"

const ColorContentDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase)
const ColorContentDefinitionWithContent = ContentDefinitionMixin(ColorContentDefinitionWithTweenable)
export class ColorContentDefinitionClass extends ColorContentDefinitionWithContent implements ColorContentDefinition {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    const { color } = object as ColorContentDefinitionObject
    if (isPopulatedString(color)) this.color = color
  }

  color = colorBlack

  instanceFromObject(object: ColorContentObject = {}): ColorContent {
    return new ColorContentClass(this.instanceArgs(object))
  }

  type = DefinitionType.ColorContent
}
