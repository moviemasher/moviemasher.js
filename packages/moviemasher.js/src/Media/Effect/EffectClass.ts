import { EffectDefinition } from "./Effect"
import { InstanceBase } from "../../Base/Instance"
import { ModularMixin } from "../../Mixin/Modular/ModularMixin"

const EffectWithModular = ModularMixin(InstanceBase)
export class EffectClass extends EffectWithModular {
  declare definition : EffectDefinition
}
