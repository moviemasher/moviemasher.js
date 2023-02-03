import { Definition, DefinitionObject } from "../Definition/Definition"
import { assertModuleDefinitionType } from "../Setup/Enums"
import { ModuleFactories } from "./ModuleFactories"

export const moduleDefinition = (object: DefinitionObject): Definition => {
  const { type } = object
  assertModuleDefinitionType(type)

  return ModuleFactories[type](object)
}