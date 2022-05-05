import { MergerClass } from "./MergerInstance"
import { DefinitionBase } from "../../Base/Definition"
import { Merger, MergerDefinition, MergerObject } from "./Merger"
import { ModularDefinitionMixin } from "../../Mixin/Modular/ModularDefinitionMixin"
import { AVType, DefinitionType } from "../../Setup/Enums"
import { Modular } from "../../Mixin/Modular/Modular"
import { Errors } from "../../Setup/Errors"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"

const MergerDefinitionWithModular = ModularDefinitionMixin(DefinitionBase)
export class MergerDefinitionClass extends MergerDefinitionWithModular implements MergerDefinition {
  populateFilterChain(filterChain: FilterChain, modular: Modular): void {
    const { filterGraph } = filterChain
    const { avType, graphType } = filterGraph
    if (avType === AVType.Audio) return

    const graphFilters = this.modularGraphFilters(modular, filterChain)

    const merger = graphFilters[0]
    if (!merger) throw Errors.internal + [this.id, this.constructor.name, "populateFilterChain no merger!", graphType, avType].join(' ')

    filterChain.graphFilter = merger
  }

  get instance() : Merger {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : MergerObject) : Merger {
    const instance = new MergerClass({ ...this.instanceObject, ...object, id: this.id })
    return instance
  }

  type = DefinitionType.Merger
}
