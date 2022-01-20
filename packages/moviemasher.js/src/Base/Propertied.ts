import { Any, Scalar } from "../declarations"
import { Errors } from "../Setup/Errors"
import { Property } from "../Setup/Property"


interface Propertied {
  property(key: string): Property | undefined
  value(key: string): SelectionValue
  setValue(key: string, value: SelectionValue): boolean
  properties: Property[]
}

type SelectionValue = Scalar | Propertied | Propertied[]

interface PropertiedChangeHandler {
  (property: string, value?: SelectionValue): void
}


class PropertiedClass implements Propertied {
  [index: string]: unknown

  constructor(..._args: Any[]) {
  }

  getPropertiedProperty(key: string): Property | undefined {
    const [propertiedKey, propertiedProperty] = key.split('.')
    const propertied = this.value(propertiedKey)
    if (typeof propertied !== 'object' || Array.isArray(propertied)) {
      throw Errors.invalid.property + key
    }

    return propertied.property(propertiedProperty)
  }

  getPropertiedValue(key: string): SelectionValue {
    const [propertiedKey, propertiedProperty] = key.split('.')
    const propertied = this.value(propertiedKey)
    if (typeof propertied !== 'object' || Array.isArray(propertied)) {
      throw Errors.invalid.property + key
    }

    return propertied.value(propertiedProperty)
  }
  property(key: string): Property | undefined {
    if (key.includes('.')) return this.getPropertiedProperty(key)

    const found = this.properties.find(property => property.name === key)
    if (!found) console.error(this.constructor.name, "property", key, this.properties.map(p => p.name))
    return found
  }

  private _properties: Property[] = []
  public get properties(): Property[] {
    return this._properties
  }
  public set properties(value: Property[]) {
    this._properties = value
  }

  setPropertiedValue(key: string, value: SelectionValue): boolean {
    const [propertiedKey, propertiedProperty] = key.split('.')
    const propertied = this.value(propertiedKey)
    if (typeof propertied !== 'object' || Array.isArray(propertied)) {
      throw Errors.invalid.property + key
    }

    return propertied.setValue(propertiedProperty, value)
  }

  setValue(key: string, value: SelectionValue): boolean {
    if (key.includes('.')) return this.setPropertiedValue(key, value)

    const property = this.property(key)
    if (!property) throw Errors.property + key

    const { type } = property
    const coerced = type.coerce(value)
    console.log(this.constructor.name, "setValue", key, value, coerced)
    if (typeof coerced === 'undefined') {
      console.error(this.constructor.name, "setValue", key, value)
      return false
    }

    this[key] = coerced
    return true
  }

  value(key: string): SelectionValue {
    if (key.includes('.')) return this.getPropertiedValue(key)

    const value = this[key]
    if (typeof value === "undefined") throw Errors.property + key

    // console.trace(this.constructor.name, "value", key, value)
    return <SelectionValue> value
  }
}

export { SelectionValue, Propertied, PropertiedClass, PropertiedChangeHandler }
