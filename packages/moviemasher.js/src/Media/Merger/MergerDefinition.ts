import { MergerClass } from "./MergerInstance"
import { DefinitionBase } from "../../Base/Definition"
import { Merger, MergerDefinition, MergerObject } from "./Merger"
import { ModularDefinitionMixin } from "../../Mixin/Modular/ModularDefinitionMixin"
import { Any, Layer, LayerArgs } from "../../declarations"
import { DefinitionType } from "../../Setup/Enums"

import { Definitions } from "../../Definitions/Definitions"
import { Modular } from "../../Mixin/Modular/Modular"
import { layerLastLabel } from "../../Utilities/Layer"

const MergerDefinitionClassOutput = 'OUT'
const MergerDefinitionWithModular = ModularDefinitionMixin(DefinitionBase)
class MergerDefinitionClass extends MergerDefinitionWithModular implements MergerDefinition {
  constructor(...args : Any[]) {
    super(...args)
    // this.properties.push(new Property({ name: "id", type: DataType.String, value: "" }))
    Definitions.install(this)
  }

  filtrateLayer(layer: Layer, modular: Modular, args: LayerArgs): void {
    const { prevLayer, layerIndex } = args
    const prevOutput = layerLastLabel(prevLayer)
    if (!prevOutput) return

    // const { layerInputs: inputs } = layer
    const output = layerLastLabel(layer)
    if (!output) return
    // if (!inputs.length) return

    const graphFilters = this.graphFilters(layer, modular, args)
    const merger = graphFilters[0]
    if (!merger) return

    const mergerInputs = [prevOutput, output]
    merger.inputs = mergerInputs
    // merger.outputs = [`L${layerIndex}`]
    // console.log(this.constructor.name, "filtrateLayer", mergerInputs)

    layer.merger = merger
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
