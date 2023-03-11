import {
  ScalarRecord, UnknownRecord
} from "../../Types/Core"
import { Identified } from "../../Base/Identified"
import { SvgFilters, SvgItems } from "../../Helpers/Svg/Svg"
import { 
  CommandFiles, CommandFilters, FilterCommandFileArgs, 
  FilterCommandFilterArgs, FilterDefinitionArgs, 
  FilterDefinitionCommandFileArgs, FilterDefinitionCommandFilterArgs 
} from "../../Base/Code"
import { Parameter, ParameterObject } from "../../Setup/Parameter"
import { Property } from "../../Setup/Property"
import { Propertied } from "../../Base/Propertied"
import { errorThrow } from "../../Helpers/Error/ErrorFunctions"
import { isObject } from "../../Utility/Is"
import { FilterType, Plugin } from "../Plugin"

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
  return isObject(value) && "instanceFromObject" in value
}
export function assertFilterDefinition(value: any, name?: string): asserts value is FilterDefinition {
  if (!isFilterDefinition(value)) errorThrow(value, 'FilterDefinition', name)
}

export interface FilterPlugin extends Plugin {
  type: FilterType
}