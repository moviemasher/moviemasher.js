import {
  Any, UnknownObject, ModularGraphFilter} from "../../declarations"
import { AVType, GraphType } from "../../Setup/Enums"
import { Property } from "../../Setup/Property"
import { Evaluator, EvaluatorArgs } from "../../Helpers/Evaluator"
import { DefinitionClass } from "../../Base/Definition"
import {
  Modular, ModularDefinition, ModularDefinitionClass, ModularDefinitionObject
} from "./Modular"
import { Filter } from "../../Media/Filter/Filter"
import { filterInstance } from "../../Media/Filter"
import {
  FilterChain} from "../../Edited/Mash/FilterChain/FilterChain"

function ModularDefinitionMixin<T extends DefinitionClass>(Base: T) : ModularDefinitionClass & T {
  return class extends Base implements ModularDefinition {
    constructor(...args : Any[]) {
      super(...args)
      const [object] = args
      const { properties, filters } = object as ModularDefinitionObject
      if (properties?.length) this.properties.push(...properties.map(property =>
        new Property({ ...property, custom: true })
      ))
      if (filters) this.filters.push(...filters.map(filter => filterInstance(filter)))
    }

    filters : Filter[] = []

    modularGraphFilters(modular: Modular, filterChain: FilterChain): ModularGraphFilter[] {
      const { filterGraph } = filterChain
      const { evaluator, graphType, preloading, avType } = filterGraph


      const modularGraphFilters = this.filters.map(filterInstance => {
        evaluator.modular = modular
        evaluator.filter = filterInstance
        // if (filterChain.visibleContext)
        evaluator.visibleContext = filterChain.visibleContext
        const modularGraphFilter: ModularGraphFilter = filterInstance.definition.modularGraphFilter(evaluator)

        if (!preloading && graphType === GraphType.Canvas && avType !== AVType.Audio) {
          // if (evaluator.visibleContextUpdated)
          filterChain.visibleContext = evaluator.visibleContext
        }
        return modularGraphFilter
      })
      return modularGraphFilters
    }

    populateFilterChain(filterChain: FilterChain, modular: Modular): void {
      // range's frame is offset of draw time in clip and frames is duration
      const modularGraphFilters = this.modularGraphFilters(modular, filterChain)
      modularGraphFilters.forEach(filter => { filterChain.addModularGraphFilter(filter)})
    }

    get propertiesCustom() : Property[] {
      return this.properties.filter(property => property.custom)
    }

    retain = true

    toJSON() : UnknownObject {
      const object = super.toJSON()
      const custom = this.propertiesCustom
      if (custom.length) object.properties = custom
      if (this.filters.length) object.filters = this.filters
      return object
    }
  }
}

export { ModularDefinitionMixin }
