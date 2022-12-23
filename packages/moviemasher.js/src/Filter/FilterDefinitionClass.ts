import { ScalarObject, SvgItem, SvgFilters, ValueObject, SvgItems } from "../declarations"
import { CommandFiles, CommandFilter, CommandFilters, FilterDefinitionArgs, FilterDefinitionCommandFileArgs, FilterDefinitionCommandFilterArgs } from "../MoveMe"
import { DataType, DefinitionType } from "../Setup/Enums"
import { Parameter } from "../Setup/Parameter"
import { DefinitionBase } from "../Definition/DefinitionBase"
import { Filter, FilterDefinition, FilterObject } from "./Filter"
import { FilterClass } from "./FilterClass"
import { Errors } from "../Setup/Errors"
import { idGenerate } from "../Utility/Id"
import { assertPopulatedString, assertValueObject } from "../Utility/Is"
import { Size } from "../Utility/Size"
import { colorWhiteTransparent } from "../Utility/Color"

export class FilterDefinitionClass extends DefinitionBase implements FilterDefinition {
  commandFiles(args: FilterDefinitionCommandFileArgs): CommandFiles {
    return []
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

  protected _ffmpegFilter?: string
  get ffmpegFilter(): string {
    return this._ffmpegFilter ||= this.id.split('.').pop() || this.id
  }

  filterDefinitionSvgs(args: FilterDefinitionArgs): SvgItems {
    throw new Error(Errors.unimplemented + 'initialSvgContent')
  }

  instanceFromObject(object: FilterObject = {}): Filter {
    return new FilterClass(this.instanceArgs(object))
  }

  parameters : Parameter[] = []

  protected populateParametersFromProperties() {
    this.parameters = this.properties.map(property => {
      const { name } = property
      return new Parameter({ name, value: name, dataType: DataType.String })
    })
  }

  filterDefinitionSvgFilter(valueObject: ScalarObject): SvgFilters {
    throw Errors.unimplemented
  }

  type = DefinitionType.Filter

}
