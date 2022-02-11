import { UnknownObject, Value, ValueObject } from "../declarations"
import { DataType, DataTypes } from "./Enums"
import { Errors } from "./Errors"

interface ParameterObject {
  name : string
  value: Value | ValueObject[]
  dataType?: DataType | string
}

class Parameter {
  constructor({ name, value, dataType } : ParameterObject) {
    if (!name) throw Errors.invalid.name
    if (typeof value === "undefined") throw Errors.invalid.value

    this.name = String(name)
    this.value = value
    if (dataType && DataTypes.map(String).includes(dataType)) {
      this.dataType = dataType as DataType
    }
  }

  dataType = DataType.Number

  name : string

  toJSON() : UnknownObject {
    return { name: this.name, value: this.value }
  }

  value : Value | ValueObject[]
}

export { Parameter, ParameterObject }
