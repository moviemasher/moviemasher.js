import { Scalar, ScalarRecord, UnknownRecord } from '@moviemasher/runtime-shared'
import { propertyTypeCoerce, propertyTypeValid } from '../Helpers/PropertyType.js'
import { Property, Properties } from '@moviemasher/runtime-shared'
import { assertObject, assertTrue } from '../Shared/SharedGuards.js'
import { isUndefined } from "@moviemasher/runtime-shared"
import { Propertied } from '@moviemasher/runtime-shared'
import { PropertyTweenSuffix } from './PropertiedConstants.js'


export class PropertiedClass implements Propertied {
  [index: string]: unknown

  constructor(...args: any[]) { 
    const [object] = args
    assertObject(object, `${this.constructor.name}(object)`)

    this.initializeProperties(object)
  }

  addProperties(object: any, ...properties: Properties) {
    assertObject(object, 'propertiesInitialize(object)')
    this.properties.push(...properties)
    properties.forEach(property => {
      this.propertyTweenSetOrDefault(object, property)
      // console.log(this.constructor.name, 'property', property.name, this[property.name])
    })
  }

  initializeProperties(object: unknown) {
    this.propertiesInitialize(object)
  }

  properties: Properties = []

  protected propertiesInitialize(object: any) {
    assertObject(object, 'propertiesInitialize(object)')
    this.properties.forEach(property => this.propertyTweenSetOrDefault(object, property))
  }

  propertyFind(name: string): Property | undefined {
    return this.properties.find(property => property.name === name)
  }

  private propertyName(name: string): string {
    if (!name.endsWith(PropertyTweenSuffix))
      return name

    return name.slice(0, -PropertyTweenSuffix.length)
  }

  private propertySetOrDefault(object: any, property: Property, name: string, defaultValue?: any) {
    const value = object[name]

    const definedValue = isUndefined(value) ? defaultValue : value
    // if (name === 'contentId' || name === 'containerId') 
    // console.log(this.constructor.name, 'propertySetOrDefault', name, definedValue, value)
    this.setValue(definedValue, name, property)
  }

  protected propertyTweenSetOrDefault(object: any, property: Property) {
    const { name, defaultValue, tweenable } = property
    // console.log(this.constructor.name, 'propertyTweenSetOrDefault', name, defaultValue, object.constructor.name)
    this.propertySetOrDefault(object, property, name, defaultValue)
    if (tweenable)
      this.propertySetOrDefault(object, property, `${name}${PropertyTweenSuffix}`)
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
      } else {
        // start value must be valid
        if (isUndefined(this[name]))
          this[name] = found.defaultValue
      }
      return
    }
    const coerced = propertyTypeCoerce(value, type)
    // console.log(this.constructor.name, 'setValue', name, coerced)
    this[name] = coerced
  }

  setValues(object: ScalarRecord): void {
    Object.entries(object).forEach(([name, value]) => {
      this.setValue(value, name)
    })
  }

  toJSON(): UnknownRecord {
    return Object.fromEntries(this.properties.flatMap(property => {
      const { name, tweenable } = property
      const entries = [[name, this.value(name)]]
      if (tweenable) {
        const key = `${name}${PropertyTweenSuffix}`
        entries.push([key, this.value(key)])
      }
      return entries
    }))
  }

  value(key: string): Scalar {
    return this[key] as Scalar
  }
}
