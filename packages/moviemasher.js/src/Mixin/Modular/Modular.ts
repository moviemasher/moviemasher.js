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

interface Modular extends Instance {
  definition: ModularDefinition
}

interface ModularDefinitionObject extends DefinitionObject {
  filters? : FilterDefinitionObject[]
  properties? : PropertyObject[]
}

interface ModularDefinition extends Definition {
  filters: Filter[]
  modularGraphFilters(modular: Modular, filterChain: FilterChain, visibleContext?: VisibleContext ): ModularGraphFilter[]
  populateFilterChain(filterChain: FilterChain, modular: Modular): void
  propertiesCustom: Property[]
}

type ModularClass = Constrained<Modular>
type ModularDefinitionClass = Constrained<ModularDefinition>

export {
  Modular,
  ModularClass,
  ModularDefinition,
  ModularDefinitionClass,
  ModularDefinitionObject,
}
