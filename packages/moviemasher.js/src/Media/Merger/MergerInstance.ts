import { Merger, MergerDefinition } from "./Merger"
import { InstanceBase } from "../../Base/Instance"
import { ModularMixin } from "../../Mixin/Modular/ModularMixin"
import { Layer, LayerArgs, Size } from "../../declarations"


const MergerWithModular = ModularMixin(InstanceBase)
class MergerClass extends MergerWithModular implements Merger {
  declare definition: MergerDefinition

  modulateLayer(layer: Layer, args: LayerArgs): void {

    this.definition.filtrateLayer(layer, this, args)
  }
}

export { MergerClass }
