import type { ChangeEditObject, ChangePropertiesEditObject, ChangePropertyEditObject, DataType, PopulatedString, Propertied, Properties, Property, PropertyId, PropertyIds, Scalar, ScalarRecord, ScalarTuple, ScalarsById, Strings, TargetId, TargetIds, Time, TimeRange, UnknownRecord } from '../types.js'

import { $BOOLEAN, $CHANGE, $CHANGES, $CONTAINER_ID, $CONTENT_ID, $END, $FRAME, $NUMBER, $PERCENT, $RGB, $STRING, DEFAULT_CONTAINER_ID, DEFAULT_CONTENT_ID, DOT, RGB_BLACK, arrayUnique, sortByOrder, } from '../runtime.js'
import { isBoolean, isPopulatedString, isScalar } from '../utility/guard.js'
import { isNumeric } from '../utility/guard.js'
import { isNumber } from '../utility/guard.js'
import { isString } from '../utility/guard.js'
import { isDefined } from '../utility/guard.js'
import { colorValid, tweenColor } from '../utility/color.js'
import { isUndefined } from '../utility/guard.js'
import { assertBoolean, assertDefined, assertNumber, assertPopulatedString, assertString, assertTrue, isPropertyId, isTargetId } from '../utility/guards.js'
import { tweenNumber } from '../utility/rect.js'
import { isTimeRange } from '../utility/time.js'


const propertyTypeValidBoolean = (value: Scalar): boolean => {
  if (isBoolean(value)) return true
  if (isNumber(value)) return value === 0 || value === 1
  return ['true', 'false', ''].includes(value as string)
}

const propertyTypeValid = (value: Scalar, dataType: DataType): boolean => {
  switch (dataType) {
    case $BOOLEAN: return propertyTypeValidBoolean(value)
    case $RGB: return colorValid(String(value))
    case $FRAME:
    case $PERCENT:
    case $NUMBER: return isNumeric(value)
    case $STRING: 
    case $CONTAINER_ID: return isString(value)
    case $CONTENT_ID:
    default: return isPopulatedString(value)
  }
}

const propertyTypeCoerce = (value: Scalar, dataType: DataType): Scalar => {
  if (dataType === $BOOLEAN) {
    if (isBoolean(value)) return value as boolean
    if (isNumeric(value)) return !!Number(value)
    return value === 'true'
  }
  if (propertyTypeRepresentedAsNumber(dataType)) return isNumeric(value) ? Number(value) : 0
  return String(value)
}

const PropertyTypesNumeric: Strings = [$FRAME, $PERCENT, $NUMBER]

const propertyTypeDefault = (dataType: DataType): Scalar => {
  switch (dataType) {
    case $CONTAINER_ID: return DEFAULT_CONTAINER_ID
    case $CONTENT_ID: return DEFAULT_CONTENT_ID
    case $BOOLEAN: return false
    case $RGB: return RGB_BLACK
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

export class PropertiedClass implements Propertied {
  constructor(object: any) {
    Object.entries(object).forEach(([key, value]) => {
      if (isScalar(value)) {
        // console.log(this.constructor.name, 'scalars', key, value)
        this.scalars[key] = value
      }
    })
  }

  boolean(key: string): boolean {
    const value = this.value(key)
    assertBoolean(value, key)
    return value
  }

  changeScalar(propertyId: PropertyId, scalar?: Scalar): ChangeEditObject {
    // console.debug(this.constructor.name, 'changeScalar', propertyId, scalar)
    const object: ChangePropertyEditObject = {
      type: $CHANGE,
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
      type: $CHANGES, redoValues: scalars, undoValues 
    }
    return args
  }
  
  constrainedValue(property: Property, value?: Scalar): Scalar | undefined {
    const { type, undefinedAllowed, name } = property
    if (!isDefined<Scalar>(value)) {
      if (undefinedAllowed) return 
      
      return property.defaultValue
    } 
    assertTrue(propertyTypeValid(value, type), `${value} not valid for ${name}`)

    return propertyTypeCoerce(value, type)
  }

  number(id: string): number {
    const value = this.value(id)
    assertNumber(value)
    return value
  }

  properties: Properties = []

  propertyFind(name: string): Property | undefined {
    return this.properties.find(property => property.name === name)
  }

  propertyIds(targetIds?: TargetIds): PropertyIds {
    const targets = targetIds?.length ? targetIds : this.propertyTargetIds
    const propertyIds = targets.flatMap(id => 
      this.propertyNamesOfTarget(id).map(name => [id, name].join(DOT))
    )
    return propertyIds.filter(isPropertyId)
  }

  private get propertyTargetIds(): TargetIds {
    const ids = this.properties.map(property => property.targetId)
    return arrayUnique(ids.filter(isTargetId))
  } 

  propertyInstance(object: Property): Property {
    const { defaultValue, ...rest } = object
    const { type, undefinedAllowed } = rest
    const dataValue = propertyValue(type, defaultValue, undefinedAllowed)
    const property: Property = { defaultValue: dataValue, ...rest }
    switch (type) {
      case $PERCENT: {
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
    const filtered = properties.flatMap(property => {
      const propertyOrNull = this.shouldSelectProperty(property, targetId)
      if (!propertyOrNull) return []

      return [property]
    })
    return filtered.sort(sortByOrder)
  }

  private scalar(propertyId: PropertyId): Scalar | undefined {
    const propertyName = propertyId.split(DOT).pop()
    if (!propertyName) return

    return this.value(propertyName)
  }

  protected get scalarRecord(): ScalarRecord {
    const record: ScalarRecord = {}
    this.properties.forEach(property => {
      const { name } = property
      const value = this.value(name)
      if (isDefined<Scalar>(value)) record[name] = value
    })
    return record
  }

  setValue(id: string, value?: Scalar): ScalarTuple {
    const name = isPropertyId(id) ? id.split(DOT).pop() : id
    assertPopulatedString(name, 'name')

    const property = this.propertyFind(name)
    assertTrue(property, name)

    const constrained = this.constrainedValue(property, value)
    this.scalars[name] = constrained
    // this[name] = constrained
    return [name, constrained]
  }

  shouldSelectProperty(property: Property, targetId: TargetId): Property | undefined {
    if (property.targetId === targetId) return  property 
  }

  private scalars: Partial<ScalarRecord> = {}

  string(id: string): string {
    const value = this.value(id)
    assertString(value, id)
    return value
  }

  declare targetId: TargetId

  toJSON(): UnknownRecord { return this.scalarRecord }

  private tweenScalar(keyPrefix: string, time: Time, range: TimeRange): Scalar {
    const value = this.value(keyPrefix)
    if (isUndefined(value)) {
      console.error(this.constructor.name, 'tween', keyPrefix, 'value undefined', this.properties.map(property => property.name))
    }
    assertDefined<Scalar>(value, keyPrefix)

    const valueEnd = this.value(`${keyPrefix}${$END}`)
    if (isUndefined(valueEnd)) return value

    if (isNumber(value) && isNumber(valueEnd)) {
      return tweenNumber(value, valueEnd, time, range)
    }
    assertPopulatedString(value)
    assertPopulatedString(valueEnd)
    return tweenColor(value, valueEnd, time, range)
  }

  tweenValues(key: string, time: Time, range: TimeRange): Scalar[] {
    const values: Scalar[] = []
    const isRange = isTimeRange(time)
    values.push(this.tweenScalar(key, isRange ? time.startTime : time, range))
    if (isRange) {
      values.push(this.tweenScalar(key, time.endTime, range))
    }
    return values
  }

  value(id: string): Scalar | undefined { 
    const name = isPropertyId(id) ? id.split(DOT).pop() : id
    if (!name) return

    // const { [name]: value } = this
    // if (isDefined(value)) {
    //   // console.log(this.constructor.name, 'value from this', name, value)
    //   return value
    // }
    const { [name]: scalar } = this.scalars
    if (isDefined(scalar)) {
      // console.log(this.constructor.name, 'value from scalars', name, scalar)
      return scalar
    }

    const property = this.propertyFind(name)
    if (!property) return
    const { defaultValue } = property
    if (isDefined(defaultValue)) {
      // console.log(this.constructor.name, 'value from property', name, defaultValue)
      return defaultValue
    }
  }
}
