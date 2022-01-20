import { InstanceBase } from "../../Base/Instance"
import { VisibleContext } from "../../Context"
import { Any, GraphFilter, UnknownObject, ValueObject } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utilities/Is"
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
    if (parameters) {
      this.parameters.push(...parameters.map(parameter => new Parameter(parameter)))
    }
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
      if (!Is.populatedString(name)) return

      const evaluatedValue = evaluator.evaluate(value)
      evaluated[name] = evaluatedValue
      evaluator.set(name, evaluatedValue)
      return `${name}=>${evaluatedValue}`
    })
    return evaluated
  }

  inputFilter(evaluator: Evaluator): GraphFilter {
    this.definition.scopeSet(evaluator)
    const evaluated = this.evaluated(evaluator)
    return this.definition.input(evaluator, evaluated)
  }

  parameters : Parameter[] = []

  toJSON() : UnknownObject {
    const object : UnknownObject = { id: this.id }
    if (this.parameters.length) object.parameters = this.parameters
    return object
  }
}

export { FilterClass }
