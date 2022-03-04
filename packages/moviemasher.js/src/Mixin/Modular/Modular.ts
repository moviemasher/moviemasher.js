import { VisibleContext } from "../../Context/VisibleContext"
import { Any, Constrained, FilterChain, FilterChainArgs, GraphFilters, Size, UnknownObject } from "../../declarations"
import { TimeRange } from "../../Helpers/TimeRange"
import { Definition, DefinitionObject } from "../../Base/Definition"
import { Filter } from "../../Media/Filter/Filter"
import { Instance, InstanceObject } from "../../Base/Instance"
import { PropertyObject } from "../../Setup/Property"
import { Preloader } from "../../Preloader/Preloader"


export interface ModularObject extends InstanceObject {
  id?: string
}

interface Modular extends Instance {
  definition: ModularDefinition
  constructProperties(object?: Any): void
  // filesModular(args: FilesArgs): GraphFiles
  modulateFilterChain(layer: FilterChain, args: FilterChainArgs): void
}

interface ModularDefinitionObject extends DefinitionObject {
  filters? : UnknownObject[]
  properties? : PropertyObject[]
}

interface ModularDefinition extends Definition {
  drawFilters(preloader: Preloader, modular: Modular, range : TimeRange, context : VisibleContext, size : Size, outContext?: VisibleContext) : VisibleContext
  filters: Filter[]
  filtrateFilterChain(layer: FilterChain, modular: Modular, args: FilterChainArgs): void
  graphFilters(layer: FilterChain, modular: Modular, args: FilterChainArgs): GraphFilters
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
