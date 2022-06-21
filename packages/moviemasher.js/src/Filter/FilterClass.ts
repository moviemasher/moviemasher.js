import { InstanceBase } from "../Instance/InstanceBase"
import { SvgContent, SvgFilters, UnknownObject, ValueObject } from "../declarations"
import { Dimensions, DimensionsDefault } from "../Setup/Dimensions"
import { Chain, ChainBuilder, GraphFilter, Transforms } from "../MoveMe"
import { Errors } from "../Setup/Errors"
import { isPopulatedObject } from "../Utility/Is"
import { Filter, FilterChainPhase, FilterDefinition, ServerFilters } from "./Filter"
import { Parameter } from "../Setup/Parameter"
import { FilterObject } from "./Filter"
import { FilterChain } from "../Edited/Mash/FilterChain/FilterChain"
import { Phase } from "../Setup/Enums"
import { TrackPreview } from "../Editor/Preview/TrackPreview/TrackPreview"
import { Propertied } from "../Base/Propertied"

export class FilterClass extends InstanceBase implements Filter {
  constructor(...args : any[]) {
    super(...args)
    const [object] = args
    if (!isPopulatedObject(object)) throw Errors.invalid.object + 'filter'

    const { parameters } = object as FilterObject
    if (parameters?.length) this.parameters.push(...parameters.map(parameter => {
      const { name, dataType } = parameter

      if (!dataType) {
        // try to determine type from same parameter in definition
        const existing = this.definition.parameters.find(p => p.name === name)
        if (existing) parameter.dataType = existing.dataType
      }
      // console.log(this.constructor.name, "constructor", parameter)
      return new Parameter(parameter)
    }))
  }

  chain(dimensions = DimensionsDefault, propertied?: Propertied): Chain { 
    return this.definition.chain(dimensions, this, propertied) 
  }

  declare definition : FilterDefinition

  filterChainPhase(filterChain: FilterChain, phase: Phase): FilterChainPhase | undefined {
    const { evaluator } = filterChain
    evaluator.filter = this
    const chainPhase = this.definition.chainPhase(filterChain, phase)
    if (!chainPhase) return

    return { link: this, ...chainPhase }
  }
  filterChainServerFilters(filterChain: FilterChain, values: ValueObject): ServerFilters {
    return this.definition.serverFilters(filterChain, values)
  }

  graphFilter(filterChain: FilterChain): GraphFilter {
    const { evaluator } = filterChain
    evaluator.filter = this
    return this.definition.graphFilter(filterChain)
  }

  svgContent(dimensions: Dimensions, filterChain: TrackPreview): SvgContent {
    const valueObject = this.valueObject(filterChain)
    return this.definition.svgContent(dimensions, valueObject)
  }

  parameters : Parameter[] = []

  _parametersDefined?: Parameter[]
  get parametersDefined(): Parameter[] {
    if (this._parametersDefined) return this._parametersDefined

    const parameters = [...this.parameters]
    parameters.push(...this.definition.parameters.filter(parameter =>
      !parameters.find(p => p.name === parameter.name)
    ))
    return this._parametersDefined = parameters
  }

  svgFilters(filterChain: TrackPreview): SvgFilters {
    const { size } = filterChain.filterGraph
    const valueObject = this.valueObject(filterChain)
    return this.definition.svgFilters(size, valueObject)
  }

  transforms(dimensions: Dimensions, filterChain: TrackPreview): Transforms {
    const valueObject = this.valueObject(filterChain)
    return this.definition.transforms(dimensions, valueObject)
  }

  toJSON() : UnknownObject {
    const object : UnknownObject = { id: this.definitionId }
    if (this.parameters.length) object.parameters = this.parameters
    return object
  }

  toString(): string {
    return `[Filter ${this.label}]`
  }

  valueObject(filterChain: ChainBuilder): ValueObject {
    const { evaluator } = filterChain
    evaluator.filter = this
    return this.definition.valueObject(filterChain)
  }
}
