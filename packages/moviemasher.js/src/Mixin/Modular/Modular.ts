import { Constrained, ModularGraphFilter } from "../../declarations"
import { VisibleContext } from "../../Context/VisibleContext"
import { Definition, DefinitionObject } from "../../Base/Definition"
import { Filter, FilterDefinitionObject } from "../../Media/Filter/Filter"
import { Instance, InstanceObject } from "../../Base/Instance"
import { Property, PropertyObject } from "../../Setup/Property"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"

export interface ModularObject extends InstanceObject {
  id?: string
}

export interface Modular extends Instance {
  definition: ModularDefinition
}

export interface ModularDefinitionObject extends DefinitionObject {
  filters? : FilterDefinitionObject[]
  properties? : PropertyObject[]
}

export interface ModularDefinition extends Definition {
  filters: Filter[]
  modularGraphFilters(modular: Modular, filterChain: FilterChain, visibleContext?: VisibleContext ): ModularGraphFilter[]
  populateFilterChain(filterChain: FilterChain, modular: Modular): void
  propertiesCustom: Property[]
}

export type ModularClass = Constrained<Modular>
export type ModularDefinitionClass = Constrained<ModularDefinition>
