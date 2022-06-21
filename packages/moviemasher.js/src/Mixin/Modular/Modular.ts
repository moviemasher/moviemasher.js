import { Constrained } from "../../declarations"
import { Definition, DefinitionObject } from "../../Definition/Definition"
import { ChainLinks, Filter, FilterDefinitionObject } from "../../Filter/Filter"
import { Instance, InstanceObject } from "../../Instance/Instance"
import { PropertyObject } from "../../Setup/Property"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"


export interface ModularObject extends InstanceObject {
  id?: string
}

export interface Modular extends Instance {
  definition: ModularDefinition

  chainLinks(): ChainLinks
}

export interface ModularDefinitionObject extends DefinitionObject {
  initializeFilter?: FilterDefinitionObject
  finalizeFilter?: FilterDefinitionObject
  filters? : FilterDefinitionObject[]
  properties? : PropertyObject[]
}

export interface ModularDefinition extends Definition {
  filters: Filter[]
}

export type ModularClass = Constrained<Modular>
export type ModularDefinitionClass = Constrained<ModularDefinition>
