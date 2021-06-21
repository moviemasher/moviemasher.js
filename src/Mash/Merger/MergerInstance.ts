import { MergerDefinition } from "./Merger"
import { InstanceClass } from "../Instance/Instance"
import { ModularMixin } from "../Mixin/Modular/ModularMixin"
import { Factory } from "../Factory"


const MergerWithModular = ModularMixin(InstanceClass)
class MergerClass extends MergerWithModular {
  definition! : MergerDefinition

  get id() : string { return this.definition.id }

  set id(value : string) {
    this.definition = Factory.merger.definitionFromId(value)
    this.constructProperties()
  }
}

export { MergerClass }
