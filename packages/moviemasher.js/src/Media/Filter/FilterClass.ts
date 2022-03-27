import { InstanceBase } from "../../Base/Instance"
import { Any, UnknownObject } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utility/Is"
import { Filter, FilterDefinition } from "./Filter"
import { Parameter } from "../../Setup/Parameter"
import { FilterObject } from "./Filter"

class FilterClass extends InstanceBase implements Filter {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args
    if (!Is.populatedObject(object)) throw Errors.invalid.object + 'filter'

    const { parameters } = object as FilterObject
    if (parameters?.length) this.parameters.push(...parameters.map(parameter => {
      const { name, dataType } = parameter

      if (!dataType) {
        // try to determine type from same parameter in definition
        const existing = this.definition.parameters.find(p => p.name === name)
        if (existing) parameter.dataType = existing.dataType
      }
      return new Parameter(parameter)
    }))
  }

  declare definition : FilterDefinition

  parameters : Parameter[] = []

  _parametersDefined?: Parameter[]
  get parametersDefined(): Parameter[] {
    if (this._parametersDefined) return this._parametersDefined

    const parameters = [...this.parameters]
    parameters.push(...this.definition.parameters.filter(parameter =>
      !parameters.find(p => p.name === parameter.name)
    ))
    return this._parametersDefined = parameters
  }

  toJSON() : UnknownObject {
    const object : UnknownObject = { id: this.definitionId }
    if (this.parameters.length) object.parameters = this.parameters
    return object
  }
}

export { FilterClass }
