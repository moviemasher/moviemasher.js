import { ScalerDefinition } from "./Scaler"
import { InstanceBase } from "../../Base/Instance"
import { ModularMixin } from "../../Mixin/Modular/ModularMixin"

const ScalerWithModular = ModularMixin(InstanceBase)
class ScalerClass extends ScalerWithModular { declare definition : ScalerDefinition }

export { ScalerClass }
