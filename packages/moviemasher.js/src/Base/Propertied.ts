import { Scalar, ScalarObject, UnknownObject } from "../declarations"
import { propertyTypeCoerce,propertyTypeValid } from "../Helpers/PropertyType"
import { Property } from "../Setup/Property"
import { assertObject, assertTrue, isUndefined } from "../Utility/Is"

export const PropertyTweenSuffix = 'End'

export interface Propertied {
  addProperties(object: any, ...properties: Property[]): void
  properties: Property[]
  setValue(value: Scalar, name: string, property?: Property ): void
  setValues(object: ScalarObject): void
  toJSON(): UnknownObject
  value(key: string): Scalar
}

export interface PropertiedChangeHandler {
  (property: string, value: Scalar): void
}

export class PropertiedClass implements Propertied {
  [index: string]: unknown

  constructor(..._args: any[]) { }

  addProperties(object: any, ...properties: Property[]) {
    this.properties.push(...properties)
    properties.forEach(property => {
      this.propertyTweenSetOrDefault(object, property)
      // console.log(this.constructor.name, "property", property.name, this[property.name])
    })
  }

  properties: Property[] = []
  

  get propertiesCustom(): Property[] {
    return this.properties.filter(property => property.custom)
  }


  protected propertiesInitialize(object: any) {
    assertObject(object)
    this.properties.forEach(property => this.propertyTweenSetOrDefault(object, property))
  }

  propertyFind(name: string): Property | undefined {
    return this.properties.find(property => property.name === name)
  }

  private propertyName(name: string): string {
    if (!name.endsWith(PropertyTweenSuffix)) return name

    return name.slice(0, -PropertyTweenSuffix.length)
  }

  private propertySetOrDefault(object: any, property: Property, name: string, defaultValue?: any) {
    const value = object[name]

    const definedValue = isUndefined(value) ? defaultValue : value
    // if (name === 'contentId' || name === 'containerId') 
    // console.log(this.constructor.name, "propertySetOrDefault", name, definedValue, object)
    this.setValue(definedValue, name, property)
  }

  protected propertyTweenSetOrDefault(object: any, property: Property) {
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
    assertTrue(found, `${this.constructor.name}.${propertyName} in ${this.properties.map(p => p.name).join(', ')}`)
    const type = found.type
    if (!propertyTypeValid(value, type)) {
      if (propertyName !== name) {
        // tween end value can be undefined
        delete this[name]
      } 
      return
    }
    const coerced = propertyTypeCoerce(value, type)
    // console.log(this.constructor.name, "setValue", name, coerced)
    this[name] = coerced
  }

  setValues(object: ScalarObject): void {
    Object.entries(object).forEach(([name, value]) => {
      this.setValue(value, name)
    })
  }

  toJSON(): UnknownObject {
    return Object.fromEntries(this.properties.flatMap(property => {
      const { name, tweenable } = property
      const entries = [[name, this.value(name)]]
      if (tweenable) {
        const key = `${name}${PropertyTweenSuffix}`
        entries.push([key, this.value(key) ])
      }
      return entries
    }))
  }

  value(key: string): Scalar {
    return this[key] as Scalar
  }
}

export const isPropertied = (value: any): value is Propertied => (
  value instanceof PropertiedClass
)
