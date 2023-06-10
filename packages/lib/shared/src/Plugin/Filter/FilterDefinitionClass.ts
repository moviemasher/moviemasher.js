import type { ScalarRecord, ValueRecord, UnknownRecord } from '@moviemasher/runtime-shared'
import type { SvgFilters, SvgItems } from '../../Helpers/Svg/Svg.js'
import type { 
  CommandFiles, CommandFilter, CommandFilters, FilterDefinitionArgs, 
  FilterDefinitionCommandFileArgs, FilterDefinitionCommandFilterArgs 
} from '../../Server/GraphFile.js'
import type { Filter, FilterDefinition, FilterDefinitionObject, FilterObject } from './Filter.js'
import type { Properties } from '@moviemasher/runtime-shared'
import type { Parameters } from '@moviemasher/runtime-shared'

import { DataTypeString } from "../../Setup/DataTypeConstants.js"
import { ParameterClass } from "../../Setup/ParameterClass.js"
import { FilterClass } from './FilterClass.js'
import { idGenerate } from '../../Utility/IdFunctions.js'
import { assertPopulatedString, assertValueRecord } from '../../Shared/SharedGuards.js'
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { ErrorName } from '../../Helpers/Error/ErrorName.js'
import { DotChar } from '../../Setup/Constants.js'

export class FilterDefinitionClass implements FilterDefinition {
  constructor(object: FilterDefinitionObject) {
    const { id } = object
    assertPopulatedString(id, 'id')

    this.id = id
  }

  id: string

  commandFiles(args: FilterDefinitionCommandFileArgs): CommandFiles {
    return []
  }
  
  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const { filter, duration, filterInput } = args
    assertPopulatedString(filterInput)
    const commandFilters: CommandFilters = []
    const options = filter.scalarObject(!!duration)
    assertValueRecord(options)
    const { ffmpegFilter } = this
    const commandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter, options, outputs: [idGenerate(ffmpegFilter)]
    }
    commandFilters.push(commandFilter)
    return commandFilters
  }

  protected commandFilter(options: ValueRecord = {}): CommandFilter {
    const { ffmpegFilter } = this
    const commandFilter: CommandFilter = { 
      ffmpegFilter, options, inputs: [], outputs: [idGenerate(ffmpegFilter)] 
    }
    return commandFilter
  }

  protected _ffmpegFilter?: string
  get ffmpegFilter(): string {
    return this._ffmpegFilter ||= this.id.split(DotChar).pop() || this.id
  }

  filterDefinitionSvgs(args: FilterDefinitionArgs): SvgItems {
    return errorThrow(ErrorName.Unimplemented)
  }

  instanceArgs(object: FilterObject = {}): FilterObject {
    const defaults = Object.fromEntries(this.properties.map(property => (
      [property.name, property.defaultValue]
    )))
    return { ...defaults, ...object, definition: this }
  }
  
  instanceFromObject(object: FilterObject = {}): Filter {
    return new FilterClass(this.instanceArgs(object))
  }

  properties: Properties = []

  parameters : Parameters = []

  protected populateParametersFromProperties() {
    this.parameters = this.properties.map(property => {
      const { name } = property
      return new ParameterClass({ name, value: name, dataType: DataTypeString })
    })
  }

  filterDefinitionSvgFilter(valueObject: ScalarRecord): SvgFilters {
    return errorThrow(ErrorName.Unimplemented)
  }


  toJSON(): UnknownRecord {
    const { id } = this
    return { id }
  }

  toString(): string { return this.id }
}
