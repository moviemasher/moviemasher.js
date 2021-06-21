import { JsonObject, ScalarValue, ValueObject } from "./declarations"
import { Errors } from "./Errors"

interface ParameterObject {
  name? : string
  value? : ScalarValue | ValueObject[]
}

class Parameter {
  constructor({ name, value } : ParameterObject) {
    if (!name) throw Errors.invalid.name
    if (typeof value === "undefined") throw Errors.invalid.value

    this.name = String(name)
    this.value = value
  }

  name : string

  toJSON() : JsonObject {
    return { name: this.name, value: this.value }
  }

  value : ScalarValue | ValueObject[]
}

export { Parameter, ParameterObject }
