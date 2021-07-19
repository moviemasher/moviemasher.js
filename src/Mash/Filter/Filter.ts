import { VisibleContext } from "../../Playing/VisibleContext";
import { GenericFactory, ValueObject } from "../../declarations";
import { Parameter, ParameterObject } from "../../Setup/Parameter";
import { Evaluator } from "../../Utilities/Evaluator";
import { Definition, DefinitionObject } from "../Definition/Definition";
import { Instance, InstanceObject } from "../Instance/Instance";


interface FilterDefinitionObject extends DefinitionObject {}

interface FilterDefinition extends Definition {
  draw(evaluator : Evaluator, evaluated : ValueObject) : VisibleContext
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
  evaluated(evaluator : Evaluator) : ValueObject
  parameters : Parameter[]
}

type FilterFactory = GenericFactory<Filter, FilterObject, FilterDefinition, FilterDefinitionObject>

export { Filter, FilterDefinition, FilterDefinitionObject, FilterFactory, FilterObject }
