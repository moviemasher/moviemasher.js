import { GenericFactory } from "../../declarations"
import {
  Modular,
  ModularDefinition,
  ModularDefinitionObject,
  ModularObject
} from "../../Mixin/Modular/Modular"

type ScalerObject = ModularObject

interface Scaler extends Modular {
  definition : ScalerDefinition
}

interface ScalerDefinitionObject extends ModularDefinitionObject {}

interface ScalerDefinition extends ModularDefinition {
  instance : Scaler
  instanceFromObject(object : ScalerObject) : Scaler
}

/**
 * @category Factory
 */
interface ScalerFactory extends GenericFactory<
  Scaler, ScalerObject, ScalerDefinition, ScalerDefinitionObject
> {}

export { Scaler, ScalerDefinition, ScalerDefinitionObject, ScalerFactory, ScalerObject }
