import { GenericFactory } from "../../declarations"
import {
  Modular,
  ModularDefinition,
  ModularDefinitionObject,
  ModularObject
} from "../../Mixin/Modular/Modular"

export type MergerObject = ModularObject

export interface Merger extends Modular {
  definition : MergerDefinition
}

export type MergerDefinitionObject = ModularDefinitionObject

export interface MergerDefinition extends ModularDefinition {
  instance : Merger
  instanceFromObject(object : MergerObject) : Merger
}

/**
 * @category Factory
 */
export interface MergerFactory extends GenericFactory<Merger, MergerObject, MergerDefinition, MergerDefinitionObject> {
}
