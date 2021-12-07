import { EffectDefinition } from "./Effect"
import { InstanceBase } from "../../Base/Instance"
import { ModularMixin } from "../../Mixin/Modular/ModularMixin"
import { JsonObject } from "../../declarations"

const EffectWithModular = ModularMixin(InstanceBase)
class EffectClass extends EffectWithModular {
  declare definition : EffectDefinition

  // toJSON() : JsonObject {
  //   const object = super.toJSON()
  //   object.id = this.id
  //   return object
  // }
}

export { EffectClass }
