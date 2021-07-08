import { ScalerDefinition } from "./Scaler"
import { InstanceClass } from "../Instance/Instance"
import { ModularMixin } from "../Mixin/Modular/ModularMixin"
import { MovieMasher } from "../../MovieMasher"

const ScalerWithModular = ModularMixin(InstanceClass)
class ScalerClass extends ScalerWithModular {
  declare definition : ScalerDefinition

  get id() : string { return this.definition.id }

  set id(value : string) {
    this.definition = MovieMasher.scaler.definitionFromId(value)
    this.constructProperties()
  }
}

export { ScalerClass }
