
import { ScalarRaw } from "../../Setup/declarations"
import { DataType } from "../../Setup/Enums"
import { TypeValue, TypeValueObject } from "../TypeValue/TypeValue"
import { Errors } from "../../Setup/Errors"

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

  id : DataType

  modular = false

  value : ScalarRaw

  values : TypeValueObject[] = []
}

export { Type, TypeObject }
