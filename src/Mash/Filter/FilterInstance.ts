import { InstanceBase } from "../../Base/Instance"
import { VisibleContext } from "../../Playing"
import { Any, InputFilter, JsonObject, ValueObject } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { Evaluator, Is } from "../../Utilities"
import { FilterDefinition } from "./Filter"
import { Parameter } from "../../Setup/Parameter"
import { FilterObject } from "./Filter"

class FilterClass extends InstanceBase {
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
    // console.log(this.constructor.name, "evaluated", this.id, parameters.map(p => p.name))
    this.definition.parameters.forEach(parameter => {
      if (parameters.find(p => p.name === parameter.name)) return

      // console.log(this.constructor.name, "evaluated", this.id, "adding", parameter.name)
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


  inputFilter(evaluator: Evaluator): InputFilter {
    this.definition.scopeSet(evaluator)
    const evaluated = this.evaluated(evaluator)
    const input = this.definition.input(evaluator, evaluated)

    // console.log(this.constructor.name, "inputFilter", input)
    return input
  }

  parameters : Parameter[] = []

  toJSON() : JsonObject {
    const object : JsonObject = { id: this.id }
    if (this.parameters.length) object.parameters = this.parameters
    return object
  }
}

export { FilterClass }
