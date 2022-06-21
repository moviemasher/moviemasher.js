import { isDefinition } from "../../Definition/Definition"
import { isInstance } from "../../Instance/Instance"
import { GenericFactory } from "../../declarations"
import { Modular, ModularObject } from "../../Mixin/Modular/Modular"
import { ModularDefinition, ModularDefinitionObject } from "../../Mixin/Modular/Modular"
import { DefinitionType } from "../../Setup/Enums"

export type EffectObject = ModularObject

export interface Effect extends Modular {
  definition : EffectDefinition
}

export const isEffect = (value?: any): value is Effect => {
  return isInstance(value) && value.type === DefinitionType.Effect
}
export function assertEffect(value?: any): asserts value is Effect {
  if (!isEffect(value)) throw new Error("expected Effect")
}


export type Effects = Effect[]

export type EffectDefinitionObject = ModularDefinitionObject

export interface EffectDefinition extends ModularDefinition {
  instanceFromObject(object?: EffectObject) : Effect
}
export const isEffectDefinition = (value?: any): value is EffectDefinition => {
  return isDefinition(value) && value.type === DefinitionType.Effect
}

/**
 * @category Factory
 */
export interface EffectFactory extends GenericFactory<
  Effect, EffectObject, EffectDefinition, EffectDefinitionObject
> {}


// TODO: consider renaming to ClipFilter
