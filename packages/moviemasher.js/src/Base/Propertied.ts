import { Any, Scalar, UnknownObject } from "../declarations"
import { dataTypeCoerce, dataTypeDefault, dataTypeValid } from "../Helpers/DataType"
import { Errors } from "../Setup/Errors"
import { Property } from "../Setup/Property"
import { isObject, isUndefined } from "../Utility/Is"

export interface Propertied {
  value(key: string): Scalar
  setValue(value: Scalar, key: string | Property ): void
  properties: Property[]
}

export interface PropertiedChangeHandler {
  (property: string, value: Scalar): void
}

export class PropertiedClass implements Propertied {
  [index: string]: unknown

  constructor(..._args: Any[]) {}

  properties: Property[] = []

  private property(propertyOrString: Property | string): Property {
    switch (typeof propertyOrString) {
      case 'string': return this.properties.find(property => property.name === propertyOrString)!
      case 'object': return propertyOrString
      default: throw Errors.invalid.property + propertyOrString + ' ' + (typeof propertyOrString)
    }
  }

  protected propertiesInitialize(object: Any) {
    this.properties.forEach(property => {
      const { name, type } = property
      const value = object[name]
      if (isObject(value)) return

      const definedValue = isUndefined(value) ? dataTypeDefault(type) : value
      this.setValue(definedValue, name)
    })
  }

  setValue(value: Scalar, propertyOrString: Property | string): void {
    const property = this.property(propertyOrString)
    const { type, name } = property
    if (!dataTypeValid(value, type)) {
      console.warn(Errors.invalid.property, name, value, type)
      return
    }
    const coerced = dataTypeCoerce(value, type)
    this[name] = coerced
    // console.log(this.constructor.name, "setValue", name, value, '=>', coerced, this[name])
  }

  toJSON(): UnknownObject {
    return Object.fromEntries(this.properties.map(property => (
      [property.name, this.value(property.name)]
    )))
  }

  value(key: string): Scalar {
    const value = this[key]
    if (typeof value === "undefined") throw Errors.property + key

    return value as Scalar
  }
}
