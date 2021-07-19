import { JsonObject, ScalarRaw } from "../declarations"
import { Errors } from "./Errors"
import { DataType } from "./Enums"
import { Type } from "../Mash/Type/Type"
import { Types } from "../Mash/Types/Types"

interface PropertyObject {
  type? : DataType
  name? : string
  value? : ScalarRaw
  custom? : boolean
}

class Property {
  constructor(object: PropertyObject) {
    const { type, name, value, custom } = object
    if (!type) throw Errors.invalid.type
    if (!name) throw Errors.invalid.name
    if (typeof value === "undefined") throw Errors.invalid.value + JSON.stringify(object)

    this.type = Types.propertyType(type)
    this.name = name
    this.value = value
    this.custom = !!custom
  }

  custom: boolean

  name : string

  toJSON() : JsonObject {
    return { value: this.value, type: this.type.id }
  }

  type : Type

  value : ScalarRaw
}

export { Property, PropertyObject }
