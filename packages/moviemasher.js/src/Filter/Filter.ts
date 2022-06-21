import {
  GenericFactory, SvgContent, SvgFilters, ValueObject
} from "../declarations"
import { Dimensions } from "../Setup/Dimensions";
import { Chain, ChainBuilder, CommandFilters, GraphFiles, GraphFilter, Transforms } from "../MoveMe";
import { Phase } from "../Setup/Enums"
import { Parameter, ParameterObject } from "../Setup/Parameter";
import { Definition, DefinitionObject } from "../Definition/Definition";
import { Instance, InstanceObject } from "../Instance/Instance";
import { FilterChain } from "../Edited/Mash/FilterChain/FilterChain"
import { TrackPreview } from "../Editor/Preview/TrackPreview/TrackPreview"
import { Propertied } from "../Base/Propertied";


export interface FilterObject extends InstanceObject {
  parameters? : ParameterObject[]
}

export interface FilterDefinitionObject extends DefinitionObject {
  phase?: string | Phase
}
export interface ServerFilters extends CommandFilters { }

export interface ChainPhase {
  values?: ValueObject
  graphFiles?: GraphFiles
}

export interface ChainLinker {
  chainLinks(): ChainLinks
}

export interface ChainLink {
  filterChainPhase(filterChain: FilterChain, phase: Phase): FilterChainPhase | undefined
  filterChainServerFilters(filterChain: FilterChain, values: ValueObject): ServerFilters
}

export type ChainLinks = ChainLink[]

export interface FilterChainPhase extends ChainPhase {
  link: ChainLink
}
export type FilterChainPhases = FilterChainPhase[]

export interface Filter extends Instance, ChainLink {
  chain(dimensions?: Dimensions, propertied?: Propertied): Chain
  definition : FilterDefinition
  parametersDefined: Parameter[]
  graphFilter(filterChain: FilterChain): GraphFilter
  svgFilters(filterChain: TrackPreview): SvgFilters
  transforms(dimensions: Dimensions, filterChain: TrackPreview): Transforms
  svgContent(dimensions: Dimensions, filterChain: TrackPreview): SvgContent
  valueObject(filterChain: ChainBuilder): ValueObject
}
export type Filters = Filter[]

export interface FilterDefinition extends Definition {
  chain(dimensions: Dimensions, filter: Filter, propertied?: Propertied): Chain
  chainPhase(filterChain: FilterChain, phase: Phase): ChainPhase | undefined
  serverFilters(filterChain: FilterChain, values: ValueObject): ServerFilters
  instanceFromObject(object?: FilterObject): Filter
  svgContent(dimensions: Dimensions, valueObject: ValueObject): SvgContent
  graphFilter(filterChain: FilterChain): GraphFilter
  valueObject(filterChain: ChainBuilder): ValueObject
  parameters: Parameter[]
  transforms(dimensions: Dimensions, valueObject: ValueObject): Transforms
  svgFilters(dimensions: Dimensions, valueObject: ValueObject): SvgFilters
}

/**
 * @category Factory
 */
export interface FilterFactory extends GenericFactory<
  Filter, FilterObject, FilterDefinition, FilterDefinitionObject
> {}
