import {
  GenericFactory, ScalarObject, SvgItem, SvgFilters, SvgItems} from "../declarations"
import { CommandFiles, CommandFilters, FilterArgs, FilterCommandFileArgs, FilterCommandFilterArgs, FilterDefinitionArgs, FilterDefinitionCommandFileArgs, FilterDefinitionCommandFilterArgs } from "../MoveMe";
import { Parameter, ParameterObject } from "../Setup/Parameter";
import { Definition, DefinitionObject } from "../Definition/Definition";
import { Instance, InstanceObject } from "../Instance/Instance";


export interface FilterObject extends InstanceObject {
  parameters? : ParameterObject[]
}

export interface FilterDefinitionObject extends DefinitionObject {}

export interface Filter extends Instance {
  commandFilters(args: FilterCommandFilterArgs): CommandFilters
  definition : FilterDefinition
  parametersDefined: Parameter[]
  filterSvgs(args?: FilterArgs): SvgItems
  filterSvgFilter(): SvgFilters
  scalarObject(tweening?: boolean): ScalarObject
  commandFiles(args: FilterCommandFileArgs): CommandFiles
}
export type Filters = Filter[]

export interface FilterDefinition extends Definition {
  commandFiles(args: FilterDefinitionCommandFileArgs): CommandFiles
  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters
  instanceFromObject(object?: FilterObject): Filter
  parameters: Parameter[]
  filterDefinitionSvgs(args: FilterDefinitionArgs): SvgItems
  filterDefinitionSvgFilter(valueObject: ScalarObject): SvgFilters
}

/**
 * @category Factory
 */
export interface FilterFactory extends GenericFactory<
  Filter, FilterObject, FilterDefinition, FilterDefinitionObject
> {}
