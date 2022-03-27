import { UnknownObject, Value, ValueObject } from "../declarations"
import { isNumeric } from "../Utility/Is"
import { DataType, DataTypes } from "./Enums"
import { Errors } from "./Errors"

interface ParameterObject {
  name : string
  value: Value | ValueObject[]
  values?: Value[]
  dataType?: DataType | string
}

class Parameter {
  constructor({ name, value, dataType, values }: ParameterObject) {
    if (!name) throw Errors.invalid.name

    this.values = values
    this.name = name
    if (typeof value === "undefined") {
      if (this.values?.length) this.value = this.values[0]
      else throw Errors.invalid.value
    } else this.value = value

    if (dataType && DataTypes.map(String).includes(dataType)) {
      this.dataType = dataType as DataType
    } else {
      let numeric = false
      if (Array.isArray(this.value)) {
        numeric = this.value.every(condition => isNumeric(condition.value))
      }
      else numeric = isNumeric(this.value)
      if (numeric) this.dataType = DataType.Number
    }
  }

  dataType = DataType.String

  name : string

  toJSON() : UnknownObject {
    return { name: this.name, value: this.value }
  }

  value: Value | ValueObject[]

  values?: Value[]
}

export { Parameter, ParameterObject }
