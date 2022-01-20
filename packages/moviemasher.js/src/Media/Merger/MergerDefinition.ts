import { MergerClass } from "./MergerInstance"
import { DefinitionBase } from "../../Base/Definition"
import { Merger, MergerDefinition, MergerObject } from "./Merger"
import { ModularDefinitionMixin } from "../../Mixin/Modular/ModularDefinitionMixin"
import { Any, Layer, LayerArgs } from "../../declarations"
import { DefinitionType } from "../../Setup/Enums"

import { Definitions } from "../../Definitions/Definitions"
import { Modular } from "../../Mixin/Modular/Modular"

const MergerDefinitionWithModular = ModularDefinitionMixin(DefinitionBase)
class MergerDefinitionClass extends MergerDefinitionWithModular implements MergerDefinition {
  constructor(...args : Any[]) {
    super(...args)
    // this.properties.push(new Property({ name: "id", type: DataType.String, value: "" }))
    Definitions.install(this)
  }

  filtrateLayer(layer: Layer, modular: Modular, args: LayerArgs): void {
    layer.merger = this.graphFilters(modular, args)[0]
  }

  get instance() : Merger {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : MergerObject) : Merger {
    const instance = new MergerClass({ ...this.instanceObject, ...object })
    return instance
  }
  retain = true

  type = DefinitionType.Merger
}

export { MergerDefinitionClass }
