import { DefinitionClass } from "../Definition/Definition"
import { Effect, EffectObject } from "./Effect"
import { ModularDefinitionMixin } from "../Mixin/Modular/ModularDefinitionMixin"
import { Any, DefinitionType } from "../../Setup"
import { Definitions } from "../Definitions/Definitions"
import { EffectClass } from "./EffectInstance"

const EffectDefinitionWithModular = ModularDefinitionMixin(DefinitionClass)
class EffectDefinitionClass extends EffectDefinitionWithModular {
  constructor(...args : Any[]) {
    super(...args)
    Definitions.install(this)
  }

  get instance() : Effect { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object : EffectObject) : Effect {
    return new EffectClass({ ...this.instanceObject, ...object })
  }

  type = DefinitionType.Effect
}

export { EffectDefinitionClass }
