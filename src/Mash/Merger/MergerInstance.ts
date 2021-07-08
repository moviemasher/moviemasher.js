import { MergerDefinition } from "./Merger"
import { InstanceClass } from "../Instance/Instance"
import { ModularMixin } from "../Mixin/Modular/ModularMixin"
import { MovieMasher } from "../../MovieMasher/MovieMasher"


const MergerWithModular = ModularMixin(InstanceClass)
class MergerClass extends MergerWithModular {
  declare definition : MergerDefinition

  get id() : string { return this.definition.id }

  set id(value : string) {
    this.definition = MovieMasher.merger.definitionFromId(value)
    this.constructProperties()
  }
}

export { MergerClass }
