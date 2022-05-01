import { Merger, MergerDefinition } from "./Merger"
import { InstanceBase } from "../../Base/Instance"
import { ModularMixin } from "../../Mixin/Modular/ModularMixin"


const MergerWithModular = ModularMixin(InstanceBase)
export class MergerClass extends MergerWithModular implements Merger {
  declare definition: MergerDefinition
}
