import type { ScalarRecord, UnknownRecord } from '../../Types/Core.js'
import type { Identified } from '../../Base/Identified.js'
import type { SvgFilters, SvgItems } from '../../Helpers/Svg/Svg.js'
import type { 
  CommandFiles, CommandFilters, FilterCommandFileArgs, 
  FilterCommandFilterArgs, FilterDefinitionArgs, 
  FilterDefinitionCommandFileArgs, FilterDefinitionCommandFilterArgs 
} from '../../Base/Code.js'
import type { Parameter, ParameterObject } from '../../Setup/Parameter.js'
import type { Property } from '../../Setup/Property.js'
import type { Propertied } from '../../Base/Propertied.js'
import type { FilterType, Plugin } from '../Plugin.js'

import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { isObject } from '../../Utility/Is.js'

export interface FilterArgs {
  propertied?: Propertied
}

export type FilterRecord = Record<string, FilterDefinition>

export const Filters: FilterRecord = {}

export interface FilterObject {
  id?: string
  parameters? : ParameterObject[]
  definition?: FilterDefinition
  label?: string
}

export interface FilterDefinitionObject extends Identified {}

export interface Filter extends Propertied {
  commandFiles(args: FilterCommandFileArgs): CommandFiles
  commandFilters(args: FilterCommandFilterArgs): CommandFilters
  definition : FilterDefinition
  filterSvgFilter(): SvgFilters
  filterSvgs(args?: FilterArgs): SvgItems
  parametersDefined: Parameter[]
  scalarObject(tweening?: boolean): ScalarRecord
}

export interface FilterDefinition extends Identified {
  commandFiles(args: FilterDefinitionCommandFileArgs): CommandFiles
  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters
  filterDefinitionSvgFilter(valueObject: ScalarRecord): SvgFilters
  filterDefinitionSvgs(args: FilterDefinitionArgs): SvgItems
  instanceFromObject(object?: FilterObject): Filter
  parameters: Parameter[]
  properties: Property[]
  toJSON(): UnknownRecord
}
export const isFilterDefinition = (value: any): value is FilterDefinition => {
  return isObject(value) && 'instanceFromObject' in value
}
export function assertFilterDefinition(value: any, name?: string): asserts value is FilterDefinition {
  if (!isFilterDefinition(value)) errorThrow(value, 'FilterDefinition', name)
}

export interface FilterPlugin extends Plugin {
  type: FilterType
}