import { ClipDefinitionObject } from "../Mixin/Clip/Clip"
import {
  Modular,
  ModularDefinition,
  ModularDefinitionObject,
  ModularObject
} from "../Mixin/Modular/Modular"
import { VisibleDefinition } from "../Mixin/Visible/Visible"
import { Transformable, TransformableObject } from "../Mixin/Transformable/Transformable"
import { GenericFactory } from "../../Setup/declarations"

type ThemeObject = ModularObject & TransformableObject

interface Theme extends Modular, Transformable {
  definition : ThemeDefinition
}

type ThemeDefinitionObject = ModularDefinitionObject & ClipDefinitionObject

interface ThemeDefinition extends Omit <ModularDefinition, "loadedVisible">, VisibleDefinition {
  instance : Theme
  instanceFromObject(object : ThemeObject) : Theme
}

interface ThemeFactory extends GenericFactory<Theme, ThemeObject, ThemeDefinition, ThemeDefinitionObject> {}

export { Theme, ThemeDefinition, ThemeDefinitionObject, ThemeFactory, ThemeObject }
