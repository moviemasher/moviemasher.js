import { Scalar } from "../declarations"
import { DataType, isDataType, assertDataType } from "./Enums"
import { propertyTypeDefault } from "../Helpers/PropertyType"
import {
  isBoolean, isNumber, isObject, isPopulatedString, isUndefined} from "../Utility/Is"
import { errorThrow } from "../Helpers/Error/ErrorFunctions"

export enum DataGroup {
  // Clicking = 'clicking',
  Color = 'color',
  // Controls = 'controls',
  Effects = 'effects',
  Opacity = 'opacity',
  Point = 'point',
  Size = 'size',
  Timing = 'timing',
}

export const DataGroups = Object.values(DataGroup)
export const isDataGroup = (value?: any): value is DataGroup => {
  return DataGroups.includes(value as DataGroup)
}
export function assertDataGroup(value: any, name?: string): asserts value is DataGroup {
  if (!isDataGroup(value)) errorThrow(value, "DataGroup", name)
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
  return isObject(value) && "type" in value && isDataType(value.type)
}
export function assertProperty(value: any, name?: string): asserts value is Property {
  if (!isProperty(value)) errorThrow(value, 'Property', name)
}

const propertyType = (type?: DataType | string, value?: Scalar): DataType => {
  if (isUndefined(type)) {
    if (isBoolean(value)) return DataType.Boolean
    if (isNumber(value)) return DataType.Number
    return DataType.String
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
    case DataType.Percent: {
      if (isUndefined(property.max)) property.max = 1.0
      if (isUndefined(property.min)) property.min = 0.0
      if (isUndefined(property.step)) property.step = 0.01
      break
    }
  }
  return property
}
