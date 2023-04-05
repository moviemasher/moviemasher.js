import { ScalarRecord, ValueRecord, UnknownRecord } from '../../Types/Core.js'
import { SvgFilters, SvgItems } from '../../Helpers/Svg/Svg.js'
import { CommandFiles, CommandFilter, CommandFilters, FilterDefinitionArgs, FilterDefinitionCommandFileArgs, FilterDefinitionCommandFilterArgs } from '../../Base/Code.js'
import { DataType } from '../../Setup/Enums.js'
import { Parameter } from '../../Setup/Parameter.js'
import { Filter, FilterDefinition, FilterDefinitionObject, FilterObject } from './Filter.js'
import { FilterClass } from './FilterClass.js'

import { idGenerate } from '../../Utility/Id.js'
import { assertPopulatedString, assertValueRecord } from '../../Utility/Is.js'
import { Property } from '../../Setup/Property.js'
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { ErrorName } from '../../Helpers/Error/ErrorName.js'

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
    return this._ffmpegFilter ||= this.id.split('.').pop() || this.id
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

  properties: Property[] = []

  parameters : Parameter[] = []

  protected populateParametersFromProperties() {
    this.parameters = this.properties.map(property => {
      const { name } = property
      return new Parameter({ name, value: name, dataType: DataType.String })
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
