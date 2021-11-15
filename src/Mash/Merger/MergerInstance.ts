import { MergerDefinition } from "./Merger"
import { InstanceBase } from "../Instance/Instance"
import { ModularMixin } from "../Mixin/Modular/ModularMixin"
import { Factory } from "../../Factory/Factory"


const MergerWithModular = ModularMixin(InstanceBase)
class MergerClass extends MergerWithModular {
  declare definition : MergerDefinition

  get id() : string { return this.definition.id }

  set id(value : string) {
    this.definition = Factory.merger.definitionFromId(value)
    this.constructProperties()
  }
}

export { MergerClass }
