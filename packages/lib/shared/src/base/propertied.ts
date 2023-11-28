import type { ChangeEditObject, ChangePropertiesEditObject, ChangePropertyEditObject } from '@moviemasher/runtime-client'
import type { DataType, Propertied, Properties, Property, PropertyId, PropertyIds, Scalar, ScalarRecord, ScalarsById, Strings, TargetId, TargetIds, UnknownRecord } from '@moviemasher/runtime-shared'

import { BOOLEAN, CHANGE, CHANGE_MULTIPLE, CONTAINER_ID, CONTENT_ID, DEFAULT_CONTAINER_ID, DEFAULT_CONTENT_ID, DOT, FRAME, NUMBER, PERCENT, RGB, RGB_BLACK, STRING, isBoolean, isDefined, isNumber, isNumeric, isPopulatedString, isString, isUndefined, sortByOrder, } from '@moviemasher/runtime-shared'
import { arrayUnique } from '@moviemasher/runtime-shared'
import { colorValid } from '../utility/color.js'
import { assertPopulatedString, assertTrue, isPropertyId } from '../utility/guards.js'

const propertyTypeValidBoolean = (value: Scalar): boolean => {
  if (isBoolean(value)) return true
  if (isNumber(value)) return value === 0 || value === 1
  return ['true', 'false', ''].includes(value as string)
}

const propertyTypeValid = (value: Scalar, dataType: DataType): boolean => {
  switch (dataType) {
    case BOOLEAN: return propertyTypeValidBoolean(value)
    case RGB: return colorValid(String(value))
    case FRAME:
    case PERCENT:
    case NUMBER: return isNumeric(value)
    case STRING: 
    case CONTAINER_ID: return isString(value)
    case CONTENT_ID:
    default: return isPopulatedString(value)
  }
}

const propertyTypeCoerce = (value: Scalar, dataType: DataType): Scalar => {
  if (dataType === BOOLEAN) {
    if (isBoolean(value)) return value as boolean
    if (isNumeric(value)) return !!Number(value)
    return value === 'true'
  }
  if (propertyTypeRepresentedAsNumber(dataType)) return isNumeric(value) ? Number(value) : 0
  return String(value)
}

export class PropertiedClass implements Propertied {
  constructor(..._: any[]) {}

  [index: string]: unknown

  changeScalar(propertyId: PropertyId, scalar?: Scalar): ChangeEditObject {
    // console.debug(this.constructor.name, 'changeScalar', propertyId, scalar)
    const object: ChangePropertyEditObject = {
      type: CHANGE,
      redoValue: scalar,
      undoValue: this.scalar(propertyId),
      property: propertyId,
      target: this
    }
    return object
  }

  changeScalars(scalars: ScalarsById): ChangeEditObject {
    const undoValues: ScalarsById = Object.fromEntries(Object.keys(scalars).map((propertyId) => {
      if (!isPropertyId(propertyId)) return []

      return [propertyId, this.scalar(propertyId)]
    }))
    const args: ChangePropertiesEditObject = {
      target: this,
      type: CHANGE_MULTIPLE, redoValues: scalars, undoValues 
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

  propertyInstance(object: Property): Property {
    const { defaultValue, ...rest } = object
    const { type, undefinedAllowed } = rest
    const dataValue = propertyValue(type, defaultValue, undefinedAllowed)
    const property: Property = { defaultValue: dataValue, ...rest }
    switch (type) {
      case PERCENT: {
        if (isUndefined(property.max)) property.max = 1.0
        if (isUndefined(property.min)) property.min = 0.0
        if (isUndefined(property.step)) property.step = 0.01
        break
      }
    }
    return property
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

const PropertyTypesNumeric: Strings = [FRAME, PERCENT, NUMBER]

const propertyTypeDefault = (dataType: DataType): Scalar => {
  switch (dataType) {
    case CONTAINER_ID: return DEFAULT_CONTAINER_ID
    case CONTENT_ID: return DEFAULT_CONTENT_ID
    case BOOLEAN: return false
    case RGB: return RGB_BLACK
  }
  return propertyTypeRepresentedAsNumber(dataType) ? 0 : ''
}

const propertyValue = (type: DataType, value?: Scalar, undefinedAllowed?: boolean): Scalar | undefined => {
  if (isDefined(value)) return value 
  if (undefinedAllowed) return undefined

  return propertyTypeDefault(type) 
}

const propertyTypeRepresentedAsNumber = (dataType: DataType): boolean => {
  return PropertyTypesNumeric.includes(dataType)
}

