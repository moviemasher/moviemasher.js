import { MergerClass } from "./MergerInstance"
import { DefinitionBase } from "../../Base/Definition"
import { Merger, MergerDefinition, MergerObject } from "./Merger"
import { ModularDefinitionMixin } from "../../Mixin/Modular/ModularDefinitionMixin"
import { Any, FilterChain, FilterChainArgs } from "../../declarations"
import { DefinitionType } from "../../Setup/Enums"

import { Definitions } from "../../Definitions/Definitions"
import { Modular } from "../../Mixin/Modular/Modular"
import { filterChainLastLabel } from "../../Helpers/FilterChain"

const MergerDefinitionWithModular = ModularDefinitionMixin(DefinitionBase)
class MergerDefinitionClass extends MergerDefinitionWithModular implements MergerDefinition {
  constructor(...args : Any[]) {
    super(...args)
    // this.properties.push(new Property({ name: "id", type: DataType.String, value: "" }))
    Definitions.install(this)
  }

  filtrateFilterChain(filterChain: FilterChain, modular: Modular, args: FilterChainArgs): void {
    const { prevFilterChain } = args
    const prevOutput = filterChainLastLabel(prevFilterChain)
    if (!prevOutput) return

    const output = filterChainLastLabel(filterChain)
    if (!output) return

    const graphFilters = this.graphFilters(filterChain, modular, args)
    const merger = graphFilters[0]
    if (!merger) return

    const mergerInputs = [prevOutput, output]
    merger.inputs = mergerInputs
    filterChain.merger = merger
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
