import { ScalarObject, SvgContent, SvgFilters, ValueObject } from "../declarations"
import { CommandFilter, CommandFilters, FilterDefinitionArgs, FilterDefinitionCommandFilterArgs } from "../MoveMe"
import { DataType, DefinitionType, isPhase, Phase } from "../Setup/Enums"
import { Parameter } from "../Setup/Parameter"
import { DefinitionBase } from "../Definition/DefinitionBase"
import { Filter, FilterDefinition, FilterDefinitionObject, FilterObject } from "./Filter"
import { FilterClass } from "./FilterClass"
import { Errors } from "../Setup/Errors"
import { Propertied } from "../Base/Propertied"
import { idGenerate } from "../Utility/Id"
import { assertPopulatedString, assertValueObject, isDefined } from "../Utility/Is"
import { Dimensions } from "../Setup/Dimensions"

export class FilterDefinitionClass extends DefinitionBase implements FilterDefinition {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    const { phase } = object as FilterDefinitionObject
    if (isPhase(phase)) this.phase = phase
  }

  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const { filter, duration, filterInput } = args
    assertPopulatedString(filterInput)
    const commandFilters: CommandFilters = []
    const options = filter.scalarObject(!!duration)
    assertValueObject(options)
    const { ffmpegFilter } = this
    const commandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter, options, outputs: [idGenerate(ffmpegFilter)]
    }
    commandFilters.push(commandFilter)
    return commandFilters
  }

  protected commandFilter(options: ValueObject = {}): CommandFilter {
    const { ffmpegFilter } = this
    const commandFilter: CommandFilter = { 
      ffmpegFilter, options, inputs: [], outputs: [idGenerate(ffmpegFilter)] 
    }
    return commandFilter
  }

  _ffmpegFilter?: string
  get ffmpegFilter(): string {
    return this._ffmpegFilter ||= this.id.split('.').pop() || this.id
  }

  filterDefinitionSvg(args: FilterDefinitionArgs): SvgContent {
    throw new Error(Errors.unimplemented + 'initialSvgContent')
  }

  instanceFromObject(object: FilterObject = {}): Filter {
    return new FilterClass(this.instanceArgs(object))
  }

  parameters : Parameter[] = []

  phase = Phase.Populate

  protected populateParametersFromProperties() {
    this.parameters = this.properties.map(property => {
      const { name } = property
      return new Parameter({ name, value: name, dataType: DataType.String })
    })
  }

  filterDefinitionSvgFilters(valueObject: ScalarObject): SvgFilters {
    return []
  }

  protected transparentCommandFilter(dimensions: Dimensions, videoRate: number, duration?: number): CommandFilter {
    const { width, height } = dimensions
    const transparentFilter = 'color'
    const transparentId = idGenerate(transparentFilter)
    const transparentOptions: ValueObject = { 
      color: '#FFFFFF00', size: `${width}x${height}`, rate: videoRate 
    }
    if (duration) transparentOptions.duration = duration
    const transparentCommandFilter: CommandFilter = {
      inputs: [], ffmpegFilter: transparentFilter, 
      options: transparentOptions,
      outputs: [transparentId]
    }
    return transparentCommandFilter
  }

  type = DefinitionType.Filter

}
