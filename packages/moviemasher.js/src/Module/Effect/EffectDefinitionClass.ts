import { DefinitionType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { Effect, EffectDefinition, EffectObject } from "./Effect"
import { EffectClass } from "./EffectClass"
import { ModularDefinitionMixin } from "../../Mixin/Modular/ModularDefinitionMixin"
import { InstanceObject } from "../../Instance"

const EffectDefinitionWithModular = ModularDefinitionMixin(DefinitionBase)
export class EffectDefinitionClass extends EffectDefinitionWithModular implements EffectDefinition {
  constructor(...args : any[]) {
    super(...args)
    this.properties.push(propertyInstance({ name: "label", defaultValue: "" }))
  }

  instanceArgs(object?: InstanceObject): InstanceObject {
    const args = super.instanceArgs(object)
    args.label ||= this.label
    return args
  }
  
  instanceFromObject(object: EffectObject = {}): Effect {
    return new EffectClass(this.instanceArgs(object))
  }

  type = DefinitionType.Effect
}
