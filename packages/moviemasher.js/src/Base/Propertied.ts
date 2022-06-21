import { Scalar, UnknownObject } from "../declarations"
import { propertyTypeCoerce,propertyTypeValid } from "../Helpers/PropertyType"
import { Time } from "../Helpers/Time/Time"
import { Errors } from "../Setup/Errors"
import { Property } from "../Setup/Property"
import { assertObject, assertTrue, isUndefined } from "../Utility/Is"

export const PropertyTweenSuffix = 'End'

export interface Propertied {
  value(key: string, time?: Time): Scalar
  setValue(value: Scalar, name: string, property?: Property ): void
  properties(): Property[]
  toJSON(): UnknownObject
}

export interface PropertiedChangeHandler {
  (property: string, value: Scalar): void
}

export class PropertiedClass implements Propertied {
  [index: string]: unknown

  constructor(..._args: any[]) { }

  protected _properties: Property[] = []
  properties(): Property[] { return this._properties }


  get propertiesCustom(): Property[] {
    return this.properties().filter(property => property.custom)
  }


  protected propertiesInitialize(object: any) {
    assertObject(object)
    const base = this._properties
    base.forEach(property => this.propertyTweenSetOrDefault(object, property))
    const custom = this.properties().filter(property => !base.includes(property))
    custom.forEach(property => this.propertyTweenSetOrDefault(object, property))
  }

  propertyFind(name: string): Property | undefined {
    return this.properties().find(property => property.name === name)
  }

  private propertyName(name: string): string {
    if (!name.endsWith(PropertyTweenSuffix)) return name
    return name.slice(0, -PropertyTweenSuffix.length)
  }

  private propertySetOrDefault(object: any, property: Property, name: string, defaultValue?: any) {
    const value = object[name]

    const definedValue = isUndefined(value) ? defaultValue : value
    // if (name === 'contentId' || name === 'containerId') console.log(this.constructor.name, "propertySetOrDefault", name, definedValue)
    this.setValue(definedValue, name, property)
  }

  private propertyTweenSetOrDefault(object: any, property: Property) {
    const { name, defaultValue, tweenable } = property
    this.propertySetOrDefault(object, property, name, defaultValue)
    if (tweenable) this.propertySetOrDefault(object, property, `${name}${PropertyTweenSuffix}`)

  }
  setValue(value: Scalar, name: string, property?: Property): void {
    if (isUndefined(value)) {
      delete this[name]
      return
    }
    const propertyName = this.propertyName(name)
    const found = property || this.propertyFind(propertyName)
    assertTrue(found, `${propertyName} ${name} ${value}`)
    const type = found.type
    if (!propertyTypeValid(value, type)) {
      console.warn(Errors.invalid.property, name, value, type)
      return
    }
    this[name] = propertyTypeCoerce(value, type)
  }

  toJSON(): UnknownObject {
    return Object.fromEntries(this.properties().map(property => (
      [property.name, this.value(property.name)]
    )))
  }

  value(key: string, time?: Time): Scalar {
    return this[key] as Scalar
  }
}

export const isPropertied = (value: any): value is Propertied => (
  value instanceof PropertiedClass
)
