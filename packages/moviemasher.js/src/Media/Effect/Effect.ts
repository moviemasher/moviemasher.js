import { GenericFactory } from "../../declarations"
import { Modular, ModularObject } from "../../Mixin/Modular/Modular"
import { ModularDefinition, ModularDefinitionObject } from "../../Mixin/Modular/Modular"

export type EffectObject = ModularObject

export interface Effect extends Modular {
  definition : EffectDefinition
}

export type Effects = Effect[]

export type EffectDefinitionObject = ModularDefinitionObject

export interface EffectDefinition extends ModularDefinition {
  instance : Effect
  instanceFromObject(object : EffectObject) : Effect
}

/**
 * @category Factory
 */
export interface EffectFactory extends GenericFactory<
  Effect, EffectObject, EffectDefinition, EffectDefinitionObject
> {}
