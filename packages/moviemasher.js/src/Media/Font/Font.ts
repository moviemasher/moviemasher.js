import { GenericFactory } from "../../declarations"
import { DefinitionObject } from "../../Base/Definition"
import { Instance, InstanceObject } from "../../Base/Instance"
import { PreloadableDefinition } from "../../Base/PreloadableDefinition"

export type FontObject = InstanceObject

export interface Font extends Instance {
  definition : FontDefinition
}

export interface FontDefinitionObject extends DefinitionObject {}

export interface FontDefinition extends PreloadableDefinition {
  instance : Font
  instanceFromObject(object : FontObject) : Font
}

/**
 * @category Factory
 */
export interface FontFactory extends GenericFactory<
  Font, FontObject, FontDefinition, FontDefinitionObject
> {}
