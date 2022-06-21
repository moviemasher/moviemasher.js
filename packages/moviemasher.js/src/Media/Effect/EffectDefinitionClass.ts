import { DefinitionType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { Effect, EffectDefinition, EffectObject } from "./Effect"
import { EffectClass } from "./EffectClass"
import { ModularDefinitionMixin } from "../../Mixin/Modular/ModularDefinitionMixin"

const EffectDefinitionWithModular = ModularDefinitionMixin(DefinitionBase)
export class EffectDefinitionClass extends EffectDefinitionWithModular implements EffectDefinition {
  constructor(...args : any[]) {
    super(...args)
    this.properties.push(propertyInstance({ name: "label", defaultValue: "" }))
  }

  instanceFromObject(object: EffectObject = {}): Effect {
    return new EffectClass(this.instanceArgs(object))
  }

  type = DefinitionType.Effect
}
