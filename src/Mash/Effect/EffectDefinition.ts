import { DefinitionBase } from "../Definition/Definition"
import { Effect, EffectObject } from "./Effect"
import { ModularDefinitionMixin } from "../Mixin/Modular/ModularDefinitionMixin"
import { Any } from "../../declarations"
import { Definitions } from "../Definitions/Definitions"
import { EffectClass } from "./EffectInstance"
import { DefinitionType } from "../../Setup/Enums"

const EffectDefinitionWithModular = ModularDefinitionMixin(DefinitionBase)
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
