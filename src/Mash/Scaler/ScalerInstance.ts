import { ScalerDefinition } from "./Scaler"
import { InstanceClass } from "../Instance/Instance"
import { ModularMixin } from "../Mixin/Modular/ModularMixin"
import { Factory } from "../Factory"

const ScalerWithModular = ModularMixin(InstanceClass)
class ScalerClass extends ScalerWithModular {
  definition! : ScalerDefinition

  get id() : string { return this.definition.id }

  set id(value : string) {
    this.definition = Factory.scaler.definitionFromId(value)
    this.constructProperties()
  }
}

export { ScalerClass }
