import { GenericFactory, ModularGraphFilter } from "../../declarations";
import { Parameter, ParameterObject } from "../../Setup/Parameter";
import { Evaluator } from "../../Helpers/Evaluator";
import { Definition, DefinitionObject } from "../../Base/Definition";
import { Instance, InstanceObject } from "../../Base/Instance";

interface FilterObject extends InstanceObject {
  parameters? : ParameterObject[]
}

interface Filter extends Instance {
  definition : FilterDefinition
  parametersDefined: Parameter[]
}

interface FilterDefinitionObject extends DefinitionObject {}

interface FilterDefinition extends Definition {
  instance: Filter
  instanceFromObject(object: FilterObject): Filter
  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter
  parameters: Parameter[]
}

/**
 * @category Factory
 */
interface FilterFactory extends GenericFactory<
  Filter, FilterObject, FilterDefinition, FilterDefinitionObject
> {}

export { Filter, FilterDefinition, FilterDefinitionObject, FilterFactory, FilterObject }
