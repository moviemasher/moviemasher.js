import type { ScalarRecord, UnknownRecord } from '@moviemasher/runtime-shared'
import type { Identified } from '@moviemasher/runtime-shared'
import type { SvgFilters, SvgItems } from '../../Helpers/Svg/Svg.js'
import type { 
  CommandFiles, CommandFilters, FilterCommandFileArgs, 
  FilterCommandFilterArgs, FilterDefinitionArgs, 
  FilterDefinitionCommandFileArgs, FilterDefinitionCommandFilterArgs 
} from '../../Base/Code.js'
import type { Parameters, ParameterObjects } from '@moviemasher/runtime-shared'
import type { Properties } from '@moviemasher/runtime-shared'
import type { Propertied } from '@moviemasher/runtime-shared'
import type { FilterType, Plugin } from '@moviemasher/runtime-shared'

export interface Filter extends Propertied {
  commandFiles(args: FilterCommandFileArgs): CommandFiles
  commandFilters(args: FilterCommandFilterArgs): CommandFilters
  definition : FilterDefinition
  filterSvgFilter(): SvgFilters
  filterSvgs(args?: FilterArgs): SvgItems
  parametersDefined: Parameters
  scalarObject(tweening?: boolean): ScalarRecord
}


export interface FilterDefinition extends Identified {
  commandFiles(args: FilterDefinitionCommandFileArgs): CommandFiles
  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters


  filterDefinitionSvgFilter(valueObject: ScalarRecord): SvgFilters
  filterDefinitionSvgs(args: FilterDefinitionArgs): SvgItems
  
  instanceFromObject(object?: FilterObject): Filter
  parameters: Parameters
  properties: Properties
  toJSON(): UnknownRecord
}


export interface FilterArgs {
  propertied?: Propertied
}

export type FilterRecord = Record<string, FilterDefinition>

export interface FilterObject {
  id?: string
  parameters? : ParameterObjects
  definition?: FilterDefinition
  label?: string
}

export interface FilterDefinitionObject extends Identified {}

export interface FilterPlugin extends Plugin {
  type: FilterType
}
