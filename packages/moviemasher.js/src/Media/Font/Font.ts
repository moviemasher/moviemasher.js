import { GenericFactory } from "../../declarations"
import { DefinitionObject } from "../../Base/Definition"
import { Instance, InstanceObject } from "../../Base/Instance"
import { PreloadableDefinition } from "../../Base/PreloadableDefinition"

type FontObject = InstanceObject

interface Font extends Instance {
  definition : FontDefinition
}

interface FontDefinitionObject extends DefinitionObject {}

interface FontDefinition extends PreloadableDefinition {
  instance : Font
  instanceFromObject(object : FontObject) : Font
}

/**
 * @category Factory
 */
interface FontFactory extends GenericFactory<
  Font, FontObject, FontDefinition, FontDefinitionObject
> {}

export { Font, FontDefinition, FontDefinitionObject, FontFactory, FontObject }
