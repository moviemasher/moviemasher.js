import { GenericFactory } from "../../declarations"
import {
  Modular,
  ModularDefinition,
  ModularDefinitionObject,
  ModularObject
} from "../../Mixin/Modular/Modular"

export type ScalerObject = ModularObject

export interface Scaler extends Modular {
  definition : ScalerDefinition
}

export interface ScalerDefinitionObject extends ModularDefinitionObject {}

export interface ScalerDefinition extends ModularDefinition {
  instance : Scaler
  instanceFromObject(object : ScalerObject) : Scaler
}

/**
 * @category Factory
 */
export interface ScalerFactory extends GenericFactory<
  Scaler, ScalerObject, ScalerDefinition, ScalerDefinitionObject
> {}
