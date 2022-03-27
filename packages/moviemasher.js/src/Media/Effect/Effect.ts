import { GenericFactory } from "../../declarations"
import { Modular, ModularObject } from "../../Mixin/Modular/Modular"
import { ModularDefinition, ModularDefinitionObject } from "../../Mixin/Modular/Modular"

type EffectObject = ModularObject

interface Effect extends Modular {
  definition : EffectDefinition
}

export type Effects = Effect[]

type EffectDefinitionObject = ModularDefinitionObject

interface EffectDefinition extends ModularDefinition {
  instance : Effect
  instanceFromObject(object : EffectObject) : Effect
}

/**
 * @category Factory
 */
interface EffectFactory extends GenericFactory<
  Effect, EffectObject, EffectDefinition, EffectDefinitionObject
> {}

export { Effect, EffectDefinition, EffectDefinitionObject, EffectFactory, EffectObject }
