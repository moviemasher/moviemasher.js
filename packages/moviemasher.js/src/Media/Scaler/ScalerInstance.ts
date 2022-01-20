import { Scaler, ScalerDefinition } from "./Scaler"
import { InstanceBase } from "../../Base/Instance"
import { ModularMixin } from "../../Mixin/Modular/ModularMixin"

const ScalerWithModular = ModularMixin(InstanceBase)
class ScalerClass extends ScalerWithModular implements Scaler {
  declare definition: ScalerDefinition
}

export { ScalerClass }
