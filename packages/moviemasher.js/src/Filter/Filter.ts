import {
  GenericFactory, ScalarObject, SvgItem, SvgFilters} from "../declarations"
import { CommandFilters, FilterArgs, FilterCommandFilterArgs, FilterDefinitionArgs, FilterDefinitionCommandFilterArgs } from "../MoveMe";
import { Phase } from "../Setup/Enums"
import { Parameter, ParameterObject } from "../Setup/Parameter";
import { Definition, DefinitionObject } from "../Definition/Definition";
import { Instance, InstanceObject } from "../Instance/Instance";


export interface FilterObject extends InstanceObject {
  parameters? : ParameterObject[]
}

export interface FilterDefinitionObject extends DefinitionObject {
  phase?: string | Phase
}

export interface Filter extends Instance {
  commandFilters(args: FilterCommandFilterArgs): CommandFilters
  definition : FilterDefinition
  parametersDefined: Parameter[]
  filterSvg(args?: FilterArgs): SvgItem
  filterSvgFilters(tweening?: boolean): SvgFilters
  scalarObject(tweening?: boolean): ScalarObject
}
export type Filters = Filter[]

export interface FilterDefinition extends Definition {
  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters
  instanceFromObject(object?: FilterObject): Filter
  parameters: Parameter[]
  filterDefinitionSvg(args: FilterDefinitionArgs): SvgItem
  filterDefinitionSvgFilters(valueObject: ScalarObject): SvgFilters
}

/**
 * @category Factory
 */
export interface FilterFactory extends GenericFactory<
  Filter, FilterObject, FilterDefinition, FilterDefinitionObject
> {}
