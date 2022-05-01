import { Scalar, Value } from "../declarations"
import { DataType } from "./Enums"
import { Errors } from "./Errors"
import { colorValid } from "../Utility/Color"
import { isNan } from "../Utility/Is"
import { Definitions } from "../Definitions/Definitions"

export interface TypeValuesObject {
  id : Value
  identifier : string
  label : string
}

export interface TypeObject {
  id? : DataType
  value? : Scalar
  values? : TypeValuesObject[]
  modular? : boolean
}

export class Type {
  constructor(object : TypeObject) {
    const { value, values, modular, id } = object
    if (!id) throw Errors.id + JSON.stringify(object)
    if (typeof value !== "undefined") this.value = value
    this.id = id
    if (modular) this.modular = modular
    if (values) this.values.push(...values)
  }

  coerce(value: Scalar): Scalar | undefined {
    const string = String(value)
    const number = Number(value)

    if (this.modular && !Definitions.fromId(string)) return

    switch (this.id) {
      case DataType.Merger:
      case DataType.Scaler: return string
      case DataType.Boolean: return !!value
      case DataType.Number: {
        if (isNan(number)) return

        return number
      }
      case DataType.Frame: {
        if (isNan(number)) return

        return Math.round(number)
      }
      case DataType.Rgb:
      case DataType.Rgba: {
        if (!colorValid(string)) return

        break
      }
      case DataType.Direction4:
      case DataType.Direction8: {
        // console.log(this.constructor.name, this.id, "coerce", number)
        if (!this.values?.find(object => Number(object.id) === number )) {
          return
        }

        return number
      }
      case DataType.Mode: {
        if (!this.values?.find(object => String(object.id) === string )) return

        break
      }
    }
    return string
  }

  id: DataType

  modular = false

  value : Scalar = ''

  values : TypeValuesObject[] = []
}
