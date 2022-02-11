import { VisibleContext } from "../../Context/VisibleContext";
import { GenericFactory, GraphFilter, FilterChainArgs, ValueObject } from "../../declarations";
import { Parameter, ParameterObject } from "../../Setup/Parameter";
import { Evaluator } from "../../Helpers/Evaluator";
import { Definition, DefinitionObject } from "../../Base/Definition";
import { Instance, InstanceObject } from "../../Base/Instance";


interface FilterDefinitionObject extends DefinitionObject {}

interface FilterDefinition extends Definition {
  draw(evaluator: Evaluator, evaluated: ValueObject): VisibleContext
  input(evaluator: Evaluator, evaluated: ValueObject, args: FilterChainArgs): GraphFilter
  instance : Filter
  instanceFromObject(object : FilterObject) : Filter
  parameters : Parameter[]
  scopeSet(evaluator : Evaluator) : void
}

interface FilterObject extends InstanceObject {
  parameters? : ParameterObject[]
}

interface Filter extends Instance {
  definition : FilterDefinition
  drawFilter(evaluator : Evaluator) : VisibleContext
  inputFilter(evaluator : Evaluator, args: FilterChainArgs) : GraphFilter
  parameters : Parameter[]
}

/**
 * @category Factory
 */
interface FilterFactory extends GenericFactory<
  Filter, FilterObject, FilterDefinition, FilterDefinitionObject
> {}

export { Filter, FilterDefinition, FilterDefinitionObject, FilterFactory, FilterObject }
