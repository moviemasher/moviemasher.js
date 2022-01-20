import { UnknownObject, Value, ValueObject } from "../declarations"
import { Errors } from "./Errors"

interface ParameterObject {
  name? : string
  value? : Value | ValueObject[]
}

class Parameter {
  constructor({ name, value } : ParameterObject) {
    if (!name) throw Errors.invalid.name
    if (typeof value === "undefined") throw Errors.invalid.value

    this.name = String(name)
    this.value = value
  }

  name : string

  toJSON() : UnknownObject {
    return { name: this.name, value: this.value }
  }

  value : Value | ValueObject[]
}

export { Parameter, ParameterObject }
