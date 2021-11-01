import { ScalarRaw, SelectionValue } from "../../declarations"
import { DataType } from "../../Setup/Enums"
import { TypeValue, TypeValueObject } from "../TypeValue/TypeValue"
import { Errors } from "../../Setup/Errors"
import { colorValid } from "../../Utilities/Color"
import { Definitions } from "../Definitions/Definitions"
import { isNan } from "../../Utilities/Is"




interface TypeObject {
  id? : DataType
  value? : ScalarRaw
  values? : TypeValueObject[]
  modular? : boolean
}

class Type {
  constructor(object : TypeObject) {
    const { value, values, modular, id } = object
    if (!id) throw Errors.id
    if (typeof value === "undefined") throw Errors.invalid.value + JSON.stringify(object)

    this.value = value
    this.id = id
    if (modular) this.modular = modular
    if (values) this.values.push(...values.map(value => new TypeValue(value)))
  }

  coerce(value: SelectionValue): ScalarRaw | undefined {
    const string = String(value)
    const number = Number(value)

    if (this.modular && !Definitions.fromId(string)) return

    switch (this.id) {
      case DataType.Boolean: return !!value
      case DataType.Number:
      case DataType.Fontsize:
      case DataType.Pixel: {
        if (isNan(number)) return

        return number
      }
      case DataType.Integer: {
        if (isNan(number)) return

        return Math.round(number)
      }
      case DataType.Rgb:
      case DataType.Rgba: {
        if (!colorValid(string)) return

        break
      }
      case DataType.Direction4:
      case DataType.Direction8:
      case DataType.Mode: {
        if (!this.values?.find(object => { object.id === string })) return

        break
      }
    }
    return string
  }

  id : DataType

  modular = false

  value : ScalarRaw

  values : TypeValueObject[] = []
}

export { Type, TypeObject }
