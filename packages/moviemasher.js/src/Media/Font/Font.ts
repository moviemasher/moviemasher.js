import { GenericFactory } from "../../declarations"
import { Definition, DefinitionObject } from "../../Base/Definition"
import { Instance, InstanceObject } from "../../Base/Instance"

type FontObject = InstanceObject

interface Font extends Instance {
  definition : FontDefinition
}

interface FontDefinitionObject extends DefinitionObject {
  source?: string
  url?: string
}

interface FontDefinition extends Definition {
  instance : Font
  instanceFromObject(object : FontObject) : Font
  source : string
}

/**
 * @category Factory
 */
interface FontFactory extends GenericFactory<
  Font, FontObject, FontDefinition, FontDefinitionObject
> {}

export { Font, FontDefinition, FontDefinitionObject, FontFactory, FontObject }
