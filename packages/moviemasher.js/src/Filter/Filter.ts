import {
  AndId, ScalarObject, SvgFilters, SvgItems, UnknownObject
} from "../declarations"
import { 
  CommandFiles, CommandFilters, FilterCommandFileArgs, 
  FilterCommandFilterArgs, FilterDefinitionArgs, 
  FilterDefinitionCommandFileArgs, FilterDefinitionCommandFilterArgs 
} from "../MoveMe"
import { Parameter, ParameterObject } from "../Setup/Parameter"
import { isDefinitionType } from "../Setup/Enums"
import { Property } from "../Setup/Property"
import { Propertied } from "../Base/Propertied"
import { errorsThrow } from "../Utility/Errors"
import { isObject } from "../Utility/Is"

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

export interface FilterDefinitionObject extends AndId {}

export interface Filter extends Propertied {
  commandFiles(args: FilterCommandFileArgs): CommandFiles
  commandFilters(args: FilterCommandFilterArgs): CommandFilters
  definition : FilterDefinition
  filterSvgFilter(): SvgFilters
  filterSvgs(args?: FilterArgs): SvgItems
  parametersDefined: Parameter[]
  propertiesCustom: Property[]
  scalarObject(tweening?: boolean): ScalarObject
}

export interface FilterDefinition {
  commandFiles(args: FilterDefinitionCommandFileArgs): CommandFiles
  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters
  filterDefinitionSvgFilter(valueObject: ScalarObject): SvgFilters
  filterDefinitionSvgs(args: FilterDefinitionArgs): SvgItems
  id: string
  instanceFromObject(object?: FilterObject): Filter
  parameters: Parameter[]
  properties: Property[]
  toJSON(): UnknownObject
}
export const isFilterDefinition = (value: any): value is FilterDefinition => {
  return isObject(value) && "instanceFromObject" in value
}
export function assertFilterDefinition(value: any, name?: string): asserts value is FilterDefinition {
  if (!isFilterDefinition(value)) errorsThrow(value, 'FilterDefinition', name)
}