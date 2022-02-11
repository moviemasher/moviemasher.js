import { UnknownObject, Scalar } from "../declarations"
import { Errors } from "./Errors"
import { DataType, DataTypes } from "./Enums"
import { Type } from "./Type"
import { Types } from "./Types"

interface PropertyObject {
  type? : DataType | string
  name? : string
  value? : Scalar
  custom? : boolean
}


class Property {
  constructor(object: PropertyObject) {
    const { type, name, value, custom } = object
    if (!(type && DataTypes.map(String).includes(type))) throw Errors.invalid.type
    if (!name) throw Errors.invalid.name

    this.type = Types.propertyType(type as DataType)
    this.name = name
    this.value = typeof value === "undefined" ? this.type.value : value
    this.custom = !!custom
  }

  custom: boolean

  name : string

  toJSON() : UnknownObject {
    return { value: this.value, type: this.type.id }
  }

  type : Type

  value : Scalar
}

export { Property, PropertyObject }
