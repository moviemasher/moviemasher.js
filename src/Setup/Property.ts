import { Any, JsonObject, ScalarRaw, SelectionValue } from "../declarations"
import { Errors } from "./Errors"
import { DataType } from "./Enums"
import { Type } from "./Type"
import { Types } from "./Types"

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


interface Propertied {
  property(key: string): Property | undefined
  value(key: string): SelectionValue
  setValue(key: string, value: SelectionValue): boolean
  properties: Property[]
}

class PropertiedClass implements Propertied {
  [index: string]: unknown

  constructor(..._args: Any[]) {
  }

  property(name : string) : Property | undefined {
    return this.properties.find(property => property.name === name)
  }
  private _properties: Property[] = []
  public get properties(): Property[] {
    return this._properties
  }
  public set properties(value: Property[]) {
    this._properties = value
  }


  setValue(key: string, value: SelectionValue): boolean {
    const property = this.property(key)
    if (!property) throw Errors.property + key

    const { type } = property
    const coerced = type.coerce(value)
    if (typeof coerced === 'undefined') {
      console.error(this.constructor.name, "setValue", key, value)
      return false
    }

    this[key] = coerced
    return true
  }

  value(key : string) : SelectionValue {
    const value = this[key]
    if (typeof value === "undefined") throw Errors.property + key

    // console.trace(this.constructor.name, "value", key, value)
    return <SelectionValue> value
  }
}

export { Property, PropertyObject, Propertied, PropertiedClass }
