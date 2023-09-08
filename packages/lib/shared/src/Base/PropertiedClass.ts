import type { ChangeActionObject, ChangePropertiesActionObject, ChangePropertyActionObject } from '@moviemasher/runtime-client'
import type { Propertied, Properties, Property, PropertyId, PropertyIds, Scalar, ScalarRecord, ScalarsById, Strings, TargetId, TargetIds, UnknownRecord } from '@moviemasher/runtime-shared'

import { isDefined } from '@moviemasher/runtime-shared'
import { ActionTypeChange, ActionTypeChangeMultiple } from '../Setup/ActionTypeConstants.js'
import { assertPopulatedString, assertTrue, isPropertyId } from '../Shared/SharedGuards.js'
import { arrayUnique } from '../Utility/ArrayFunctions.js'
import { sortByOrder } from '../Utility/SortFunctions.js'
import { propertyTypeCoerce, propertyTypeValid } from './PropertyTypeFunctions.js'
import { DOT } from '../Setup/Constants.js'

export class PropertiedClass implements Propertied {
  constructor(..._: any[]) {}

  [index: string]: unknown

  changeScalar(propertyId: PropertyId, scalar?: Scalar): ChangeActionObject {
    // console.debug(this.constructor.name, 'changeScalar', propertyId, scalar)
    const object: ChangePropertyActionObject = {
      type: ActionTypeChange,
      redoValue: scalar,
      undoValue: this.scalar(propertyId),
      property: propertyId,
      target: this
    }
    return object
  }

  changeScalars(scalars: ScalarsById): ChangeActionObject {
    const undoValues: ScalarsById = Object.fromEntries(Object.keys(scalars).map((propertyId) => {
      if (!isPropertyId(propertyId)) return []

      return [propertyId, this.scalar(propertyId)]
    }))
    const args: ChangePropertiesActionObject = {
      target: this,
      type: ActionTypeChangeMultiple, redoValues: scalars, undoValues 
    }
    return args
  }

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
      this.propertyNamesOfTarget(id).map(name => [id, name].join(DOT))
    )
    // console.debug(this.constructor.name, 'propertyIds', targetIds, propertyIds)
    return propertyIds.filter(isPropertyId)
  }

  private get propertyTargetIds(): TargetIds {
    return arrayUnique(this.properties.map(property => property.targetId))
  } 

  protected selectorTypesPropertyNames(selectorTypes: Strings, targetId: TargetId): Strings {
    const { length } = selectorTypes
    const populated = length ? selectorTypes : this.propertyNamesOfTarget(targetId)
    return arrayUnique(populated)
  }

  private propertyNamesOfTarget(targetId: TargetId): Strings {
    return this.propertiesOfTarget(targetId).map(property => property.name)
  }

  private propertiesOfTarget(targetId: TargetId): Properties {
    const { properties } = this
    const filtered = properties.filter(property => 
      property.targetId === targetId && this.shouldSelectProperty(property.name)
    )

    return filtered.sort(sortByOrder)
  }

  protected scalar(propertyId: PropertyId): Scalar | undefined {
    const propertyName = propertyId.split(DOT).pop()
    if (!propertyName) return

    return this.value(propertyName)
  }

  get scalarRecord(): ScalarRecord {
    const record: ScalarRecord = {}
    this.properties.forEach(property => {
      const { name } = property
      const value = this.value(name)
      if (isDefined<Scalar>(value)) record[name] = value
    })
    return record
  }
  
  setValue(id: string, value?: Scalar, property?: Property): void {
    const name = isPropertyId(id) ? id.split(DOT).pop() : id
    assertPopulatedString(name, 'name')

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

  protected shouldSelectProperty(_name: string): boolean {
    return true
  }

  declare targetId: TargetId

  toJSON(): UnknownRecord { return this.scalarRecord }

  value(id: string): Scalar | undefined { 
    const name = isPropertyId(id) ? id.split(DOT).pop() : id
    if (!name) return

    return this[name] as Scalar | undefined
  }
}
