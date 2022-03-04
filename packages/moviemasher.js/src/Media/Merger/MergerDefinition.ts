import { MergerClass } from "./MergerInstance"
import { DefinitionBase } from "../../Base/Definition"
import { Merger, MergerDefinition, MergerObject } from "./Merger"
import { ModularDefinitionMixin } from "../../Mixin/Modular/ModularDefinitionMixin"
import { FilterChain, FilterChainArgs } from "../../declarations"
import { DefinitionType } from "../../Setup/Enums"

import { Modular } from "../../Mixin/Modular/Modular"
import { filterChainLastLabel } from "../../Helpers/FilterChain"

const MergerDefinitionWithModular = ModularDefinitionMixin(DefinitionBase)
class MergerDefinitionClass extends MergerDefinitionWithModular implements MergerDefinition {
  filtrateFilterChain(filterChain: FilterChain, modular: Modular, args: FilterChainArgs): void {
    const { filterGraph, index, length, justGraphFiles } = args
    const { filterChains } = filterGraph

    const graphFilters = this.graphFilters(filterChain, modular, args)
    const merger = graphFilters[0]
    if (!merger) return


    if (!justGraphFiles) {
      const prevFilterChain = filterChains[index]
      if (!prevFilterChain) {
        console.warn(this.constructor.name, "filtrateFilterChain no previous FilterChain", index, filterChains.length)
        return
      }
      const prevGraphFilter = prevFilterChain.graphFilter
      const prevGraphFilters = prevFilterChain.graphFilters
      const last = prevGraphFilter || prevGraphFilters[prevGraphFilters.length - 1]
      if (!last) {
        console.warn(this.constructor.name, "filtrateFilterChain no previous GraphFilter or GraphFilters")
        return
      }

      const { outputs } = last
      if (!outputs) {
        console.warn(this.constructor.name, "filtrateFilterChain no last outputs")
        return
      }

      const prevOutput = outputs[outputs.length - 1]
      if (!prevOutput) {
        console.warn(this.constructor.name, "filtrateFilterChain no previous outputs")
        return
      }

      const output = filterChainLastLabel(filterChain)
      if (!output) {
        console.warn(this.constructor.name, "filtrateFilterChain no output")
        return
      }

      merger.inputs = [prevOutput, output]
      if (index < length - 1) merger.outputs = [`LAYER${index}`]
    }
    filterChain.graphFilter = merger
  }

  get instance() : Merger {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : MergerObject) : Merger {
    const instance = new MergerClass({ ...this.instanceObject, ...object, id: this.id })
    return instance
  }
  retain = true

  type = DefinitionType.Merger
}

export { MergerDefinitionClass }
