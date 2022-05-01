import { ClipDefinitionObject } from "../../Mixin/Clip/Clip"
import {
  Modular,
  ModularDefinition,
  ModularDefinitionObject,
  ModularObject
} from "../../Mixin/Modular/Modular"
import { VisibleDefinition } from "../../Mixin/Visible/Visible"
import { Transformable, TransformableObject } from "../../Mixin/Transformable/Transformable"
import { GenericFactory } from "../../declarations"

export type ThemeObject = ModularObject & TransformableObject

export interface Theme extends Modular, Transformable {
  definition : ThemeDefinition
}

export type ThemeDefinitionObject = ModularDefinitionObject & ClipDefinitionObject

export interface ThemeDefinition extends ModularDefinition, VisibleDefinition {
  instance : Theme
  instanceFromObject(object : ThemeObject) : Theme
}

/**
 * @category Factory
 */
export interface ThemeFactory extends GenericFactory<Theme, ThemeObject, ThemeDefinition, ThemeDefinitionObject> {}
