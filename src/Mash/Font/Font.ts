import { GenericFactory } from "../../declarations"
import { Definition, DefinitionObject } from "../Definition/Definition"
import { Instance, InstanceObject } from "../Instance/Instance"

type FontObject = InstanceObject

interface Font extends Instance {
  definition : FontDefinition
}

interface FontDefinitionObject extends DefinitionObject {
  source? : string
}

interface FontDefinition extends Definition {
  absoluteUrl: string
  instance : Font
  instanceFromObject(object : FontObject) : Font
  source : string
}

type FontFactory = GenericFactory<Font, FontObject, FontDefinition, FontDefinitionObject>

export { Font, FontDefinition, FontDefinitionObject, FontFactory, FontObject }
