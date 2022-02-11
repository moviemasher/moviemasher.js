import { InstanceBase } from "../../Base/Instance"
import { VisibleContext } from "../../Context"
import { Any, GraphFilter, FilterChainArgs, UnknownObject, ValueObject } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utility/Is"
import { Evaluator } from "../../Helpers/Evaluator"
import { Filter, FilterDefinition } from "./Filter"
import { Parameter } from "../../Setup/Parameter"
import { FilterObject } from "./Filter"

class FilterClass extends InstanceBase implements Filter {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args
    if (!Is.populatedObject(object)) throw Errors.invalid.object + 'filter'

    const { parameters } = <FilterObject> object
    if (parameters?.length) this.parameters.push(...parameters.map(parameter => {
      const { name, dataType } = parameter

      if (!dataType) {
        const existing = this.definition.parameters.find(p => p.name === name)
        if (existing) parameter.dataType = existing.dataType
      }
      return new Parameter(parameter)
    }))
  }

  declare definition : FilterDefinition

  drawFilter(evaluator : Evaluator) : VisibleContext {
    this.definition.scopeSet(evaluator)
    const evaluated = this.evaluated(evaluator)
    return this.definition.draw(evaluator, evaluated)
  }

  evaluated(evaluator : Evaluator) : ValueObject {
    const evaluated : ValueObject = {}
    const parameters = [...this.parameters]
    this.definition.parameters.forEach(parameter => {
      if (parameters.find(p => p.name === parameter.name)) return

      parameters.push(parameter)
    })

    if (!Is.populatedArray(parameters)) return evaluated

    parameters.forEach(parameter => {
      const { name, value } = parameter
      const evaluatedValue = evaluator.evaluate(value)
      // const quoted = typeof evaluatedValue === 'number' ? String(evaluatedValue) : `'${evaluatedValue}'`
      evaluated[name] = evaluatedValue
      evaluator.set(name, evaluatedValue, parameter.dataType)
    })
    return evaluated
  }

  inputFilter(evaluator: Evaluator, args: FilterChainArgs): GraphFilter {
    this.definition.scopeSet(evaluator)
    const evaluated = this.evaluated(evaluator)
    // console.log('evaluated', evaluated)
    return this.definition.input(evaluator, evaluated, args)
  }

  parameters : Parameter[] = []

  toJSON() : UnknownObject {
    const object : UnknownObject = { id: this.id }
    if (this.parameters.length) object.parameters = this.parameters
    return object
  }
}

export { FilterClass }
