import { SvgContent, SvgFilters, ValueObject } from "../declarations"
import { Dimensions } from "../Setup/Dimensions"
import { Chain, ChainBuilder, CommandFilter, GraphFilter, Transforms } from "../MoveMe"
import { DataType, DefinitionType, isPhase, Phase } from "../Setup/Enums"
import { Parameter } from "../Setup/Parameter"
import { DefinitionBase } from "../Definition/DefinitionBase"
import { ChainPhase, Filter, FilterDefinition, FilterDefinitionObject, FilterObject, ServerFilters } from "./Filter"
import { FilterClass } from "./FilterClass"
import { FilterChain } from "../Edited/Mash/FilterChain/FilterChain"
import { Errors } from "../Setup/Errors"
import { Propertied } from "../Base"

export class FilterDefinitionClass extends DefinitionBase implements FilterDefinition {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    const { phase } = object as FilterDefinitionObject
    if (isPhase(phase)) this.phase = phase
  }

  chain(dimensions: Dimensions, filter: Filter, propertied?: Propertied): Chain {
    return { commandFiles: [], commandFilters: [] } 
  }
  
  chainValues(filter: Filter, propertied?: Propertied): ValueObject {
    const entries = this.properties.map(property => {
      const { name } = property
      return [name, propertied?.value(name) || filter.value(name)]
    })
    return Object.fromEntries(entries)
  }

  protected commandFilter(options: ValueObject = {}): CommandFilter {
    const { ffmpegFilter } = this
    const commandFilter: CommandFilter = { ffmpegFilter, options, inputs: [] }
    return commandFilter
  }

  _ffmpegFilter?: string
  get ffmpegFilter(): string {
    return this._ffmpegFilter ||= this.id.split('.').pop() || this.id
  }
  filterChain(filterChain: FilterChain): ChainPhase | undefined {
    return { values: filterChain.evaluator.parameters }
  }

  chainPhase(filterChain: FilterChain, phase: Phase): ChainPhase | undefined {
    if (this.phase !== phase) return

    return this.filterChain(filterChain)
  }

  serverFilters(filterChain: FilterChain, values: ValueObject): ServerFilters {
    return [this.commandFilter(values)]
  }

  graphFilter(filterChain: FilterChain): GraphFilter {
    const { ffmpegFilter } = this
    const { evaluator } = filterChain
    const { filter } = evaluator
    const graphFilter: GraphFilter = {
      ffmpegFilter, filter, options: evaluator.parameters, inputs: []
    }
    return graphFilter
  }

  svgContent(dimensions: Dimensions, valueObject: ValueObject): SvgContent {
    throw new Error(Errors.unimplemented + 'initialSvgContent')
  }

  instanceFromObject(object: FilterObject = {}): Filter {
    return new FilterClass(this.instanceArgs(object))
  }

  parameters : Parameter[] = []

  phase = Phase.Populate

  protected populateParametersFromProperties() {
    this.parameters.push(...this.properties.map(property => {
      const { name } = property
      return new Parameter({ name, value: name, dataType: DataType.String })
    }))
  }

  svgFilters(dimensions: Dimensions, valueObject: ValueObject): SvgFilters {
    return []
  }

  transforms(dimensions: Dimensions, valueObject: ValueObject): Transforms {
    return []
  }
  type = DefinitionType.Filter

  valueObject(filterChain: ChainBuilder): ValueObject {
    const { evaluator } = filterChain
    return evaluator.parameters
  }
}
