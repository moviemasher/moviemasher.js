import { GenericFactory, ModularGraphFilter } from "../../declarations";
import { Parameter, ParameterObject } from "../../Setup/Parameter";
import { Evaluator } from "../../Helpers/Evaluator";
import { Definition, DefinitionObject } from "../../Base/Definition";
import { Instance, InstanceObject } from "../../Base/Instance";

export interface FilterObject extends InstanceObject {
  parameters? : ParameterObject[]
}

export interface Filter extends Instance {
  definition : FilterDefinition
  parametersDefined: Parameter[]


}

export interface FilterDefinitionObject extends DefinitionObject {


}

export interface FilterDefinition extends Definition {
  instance: Filter
  instanceFromObject(object: FilterObject): Filter
  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter
  parameters: Parameter[]
  inputCountMin: number
  inputCountMax: number
  outputCount: number
}

/**
 * @category Factory
 */
export interface FilterFactory extends GenericFactory<
  Filter, FilterObject, FilterDefinition, FilterDefinitionObject
> {}
