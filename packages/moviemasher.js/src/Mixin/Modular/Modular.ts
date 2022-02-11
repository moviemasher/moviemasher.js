import { VisibleContext } from "../../Context/VisibleContext"
import { Any, Constrained, GraphFilter, FilterChain, FilterChainArgs, LoadPromise, Size, UnknownObject, FilesArgs, GraphFile } from "../../declarations"
import { TimeRange } from "../../Helpers/TimeRange"
import { Definition, DefinitionObject } from "../../Base/Definition"
import { Filter } from "../../Media/Filter/Filter"
import { Instance, InstanceObject } from "../../Base/Instance"
// import { Time } from "../../Helpers/Time"
import { PropertyObject } from "../../Setup/Property"
import { Preloader } from "../../Preloader/Preloader"


type ModularObject = InstanceObject

interface Modular extends Instance {
  definition: ModularDefinition
  constructProperties(object?: Any): void
  filesModular(args: FilesArgs): GraphFile[]
  // loadModular(quantize: number, start: Time, end?: Time): LoadPromise | void
  // modularUrls(quantize: number, start: Time, end?: Time): string[]
  modulateFilterChain(layer: FilterChain, args: FilterChainArgs): void
}

interface ModularDefinitionObject extends DefinitionObject {
  filters? : UnknownObject[]
  properties? : PropertyObject[]
}

// but Definition uses an array of properties to ease filtering/sorting
interface ModularDefinition extends Definition {
  drawFilters(preloader: Preloader, modular: Modular, range : TimeRange, clipRange : TimeRange, context : VisibleContext, size : Size, outContext?: VisibleContext) : VisibleContext
  filters: Filter[]
  filtrateFilterChain(layer: FilterChain, modular: Modular, args: FilterChainArgs): void
  graphFilters(layer: FilterChain, modular: Modular, args: FilterChainArgs): GraphFilter[]
}

type ModularClass = Constrained<Modular>
type ModularDefinitionClass = Constrained<ModularDefinition>

export {
  Modular,
  ModularClass,
  ModularDefinition,
  ModularDefinitionClass,
  ModularDefinitionObject,
  ModularObject,
}
