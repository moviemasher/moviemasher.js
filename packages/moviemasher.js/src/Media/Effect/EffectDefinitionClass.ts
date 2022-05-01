import { Any } from "../../declarations"
import { DefinitionType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { DefinitionBase } from "../../Base/Definition"
import { Effect, EffectDefinition, EffectObject } from "./Effect"
import { EffectClass } from "./EffectClass"
import { ModularDefinitionMixin } from "../../Mixin/Modular/ModularDefinitionMixin"

const EffectDefinitionWithModular = ModularDefinitionMixin(DefinitionBase)
export class EffectDefinitionClass extends EffectDefinitionWithModular implements EffectDefinition {
  constructor(...args : Any[]) {
    super(...args)
    this.properties.push(propertyInstance({ name: "label", defaultValue: "" }))
  }

  get instance() : Effect { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object : EffectObject) : Effect {
    return new EffectClass({ ...this.instanceObject, ...object })
  }

  type = DefinitionType.Effect
}
