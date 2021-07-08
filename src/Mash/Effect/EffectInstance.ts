import { EffectDefinition } from "./Effect"
import { InstanceClass } from "../Instance/Instance"
import { ModularMixin } from "../Mixin/Modular/ModularMixin"
import { JsonObject } from "../../Setup/declarations"

const EffectWithModular = ModularMixin(InstanceClass)
class EffectClass extends EffectWithModular {
  declare definition : EffectDefinition

  toJSON() : JsonObject {
    const object = super.toJSON()
    object.id = this.id
    return object
  }
}

export { EffectClass }
