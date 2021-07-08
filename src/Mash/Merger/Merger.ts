import { GenericFactory } from "../../Setup/declarations"
import {
  Modular,
  ModularDefinition,
  ModularDefinitionObject,
  ModularObject
} from "../Mixin/Modular/Modular"

type MergerObject = ModularObject

interface Merger extends Modular {
  definition : MergerDefinition
}

type MergerDefinitionObject = ModularDefinitionObject

interface MergerDefinition extends ModularDefinition {
  instance : Merger
  instanceFromObject(object : MergerObject) : Merger
}

interface MergerFactory extends GenericFactory<Merger, MergerObject, MergerDefinition, MergerDefinitionObject> {
}

export { Merger, MergerDefinition, MergerDefinitionObject, MergerFactory, MergerObject }
