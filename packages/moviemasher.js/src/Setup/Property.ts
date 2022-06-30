import { Scalar } from "../declarations"
import { assertPropertyType, DataType, isPropertyType, PropertyType } from "./Enums"
import { propertyTypeDefault } from "../Helpers/PropertyType"
import {
  isBoolean, isNumber, isObject, isPopulatedString, isUndefined
} from "../Utility/Is"

export interface PropertyObject {
  custom? : boolean
  defaultValue? : Scalar
  max?: number
  min?: number
  name? : string
  step?: number
  tweenable?: boolean
  type? : PropertyType | string
}

export interface Property  {
  custom?: boolean
  defaultValue: Scalar
  max?: number
  min?: number
  name: string
  step?: number
  tweenable?: boolean
  type: PropertyType
}

export const isProperty = (value: any): value is Property => {
  return isObject(value) && "type" in value && isPropertyType(value.type)
}

const propertyType = (type?: PropertyType | string, value?: Scalar): PropertyType => {
  if (isUndefined(type)) {
    if (isBoolean(value)) return DataType.Boolean
    if (isNumber(value)) return DataType.Number
    return DataType.String
  }
  assertPropertyType(type)

  return type
}

const propertyValue = (type: PropertyType, value?: Scalar): Scalar => {
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
