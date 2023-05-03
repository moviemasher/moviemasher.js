import type { Scalar } from '../Types/Core.js'

import type { DataType } from './Enums.js'


import { DataTypeBoolean, DataTypeNumber, DataTypePercent, DataTypeString } from './Enums.js'

import { isDataType, assertDataType } from './Enums.js'
import { propertyTypeDefault } from '../Helpers/PropertyType.js'
import {
  isBoolean, isNumber, isObject, isPopulatedString, isUndefined
} from '../Utility/Is.js'
import { errorThrow } from '../Helpers/Error/ErrorFunctions.js'

export type ColorDataGroup = 'color'
export type EffectsDataGroup = 'effects'
export type OpacityDataGroup = 'opacity'
export type PointDataGroup = 'point'
export type SizeDataGroup = 'size'
export type TimingDataGroup = 'timing'

export type DataGroup = ColorDataGroup | EffectsDataGroup | OpacityDataGroup | PointDataGroup | SizeDataGroup | TimingDataGroup

export const DataGroupColor: DataGroup = 'color'
export const DataGroupEffects: DataGroup = 'effects'
export const DataGroupOpacity: DataGroup = 'opacity'
export const DataGroupPoint: DataGroup = 'point'
export const DataGroupSize: DataGroup = 'size'
export const DataGroupTiming: DataGroup = 'timing'

export const DataGroups = [
  DataGroupColor, DataGroupEffects, DataGroupOpacity, DataGroupPoint, DataGroupSize, DataGroupTiming
]
export const isDataGroup = (value?: any): value is DataGroup => {
  return DataGroups.includes(value as DataGroup)
}
export function assertDataGroup(value: any, name?: string): asserts value is DataGroup {
  if (!isDataGroup(value)) errorThrow(value, 'DataGroup', name)
}

export interface PropertyBase {
  custom?: boolean
  defaultValue: Scalar
  group?: DataGroup
  max?: number
  min?: number
  name: string
  step?: number
  tweenable?: boolean
  options?: Scalar[]
}
export interface Property extends PropertyBase {
  type: DataType
}

export interface PropertyObject extends Partial<PropertyBase> {
  type? : DataType | string
}

export const isProperty = (value: any): value is Property => {
  return isObject(value) && 'type' in value && isDataType(value.type)
}
export function assertProperty(value: any, name?: string): asserts value is Property {
  if (!isProperty(value)) errorThrow(value, 'Property', name)
}

const propertyType = (type?: DataType | string, value?: Scalar): DataType => {
  if (isUndefined(type)) {
    if (isBoolean(value)) return DataTypeBoolean
    if (isNumber(value)) return DataTypeNumber
    return DataTypeString
  }
  assertDataType(type)

  return type
}

const propertyValue = (type: DataType, value?: Scalar): Scalar => {
  if (isUndefined(value)) return propertyTypeDefault(type)

  return value!
}

export const propertyInstance = (object: PropertyObject):Property => {
  const { type, name, defaultValue, ...rest } = object
  const dataType = propertyType(type, defaultValue)
  const dataValue = propertyValue(dataType, defaultValue)
  const dataName = isPopulatedString(name) ? name : dataType
  const property: Property = { 
    type: dataType, defaultValue: dataValue, name: dataName, ...rest 
  }
  switch(type) {
    case DataTypePercent: {
      if (isUndefined(property.max)) property.max = 1.0
      if (isUndefined(property.min)) property.min = 0.0
      if (isUndefined(property.step)) property.step = 0.01
      break
    }
  }
  return property
}
