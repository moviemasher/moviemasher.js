import type { Propertied, Properties, Property, PropertyIds, Scalar, ScalarRecord, Strings, TargetId, TargetIds, UnknownRecord } from '@moviemasher/runtime-shared'

import { isPropertyId } from '@moviemasher/runtime-client'
import { DotChar, isDefined } from '@moviemasher/runtime-shared'

import { assertTrue } from '../Shared/SharedGuards.js'
import { arrayUnique } from '../Utility/ArrayFunctions.js'
import { propertyTypeCoerce, propertyTypeValid } from './PropertyTypeFunctions.js'
import { sortByFrame, sortByOrder } from '../Utility/SortFunctions.js'


export class PropertiedClass implements Propertied {
  constructor(..._: any[]) {}

  [index: string]: unknown

  initializeProperties(object: unknown) { this.propertiesInitialize(object) }

  properties: Properties = []

  protected propertiesInitialize(object: any) {
    this.properties.forEach(property => {
      const { name, defaultValue } = property    
      const value = object[name]
      const wasDefined = isDefined(value)
      if (!wasDefined && property.undefinedAllowed) return
      
      this.setValue(name, wasDefined ? value : defaultValue, property)  
    })
  }

  propertyFind(name: string): Property | undefined {
    return this.properties.find(property => property.name === name)
  }

  propertyIds(targetIds?: TargetIds): PropertyIds {
    const targets = targetIds?.length ? targetIds : this.propertyTargetIds
    const propertyIds = targets.flatMap(id => 
      this.propertyNamesOfTarget(id).map(name => [id, name].join(DotChar))
    )
    return propertyIds.filter(isPropertyId)
  }

  protected get propertyTargetIds(): TargetIds {
    return arrayUnique(this.properties.map(property => property.targetId))
  } 

  protected selectorTypesPropertyNames(selectorTypes: Strings, targetId: TargetId): Strings {
    const { length } = selectorTypes
    // const propertyTargetIds = this.propertyTargetIds as Strings
    const populated = length ? selectorTypes : this.propertyNamesOfTarget(targetId)
    // const propertyNames = populated.flatMap(selectorType => {
    //   if (!propertyTargetIds.includes(selectorType)) return [selectorType]
    //   if (!isTargetId(selectorType)) return []

    //   return this.propertiesOfTarget(selectorType).map(property => property.name)
    // })
    return arrayUnique(populated)
  }

  protected propertyNamesOfTarget(targetId: TargetId): Strings {
    return this.propertiesOfTarget(targetId).map(property => property.name)
  }

  protected propertiesOfTarget(targetId: TargetId): Properties {
    const { properties } = this
    const filtered = properties.filter(property => property.targetId === targetId)

    return filtered.sort(sortByOrder)
  }

  setValue(name: string, value?: Scalar, property?: Property): void {
    const found = property || this.propertyFind(name)
    assertTrue(found, name)

    const { type, undefinedAllowed } = found
    if (!isDefined<Scalar>(value)) {
      if (undefinedAllowed) delete this[name]
      else this[name] = found.defaultValue
      return
    } 
    assertTrue(propertyTypeValid(value, type), `${value} not valid for ${name}`)

    this[name] = propertyTypeCoerce(value, type)
  }

  toJSON(): UnknownRecord {
    const { properties } = this
    const names = properties.map(property => property.name)
    return Object.fromEntries(names.map(name => ([name, this.value(name)])))
  }

  value(name: string): Scalar | undefined { 
    return this[name] as Scalar | undefined
  }
}
