import { Scalar } from "../declarations"
import { IdPrefix, IdSuffix } from "../Setup/Constants"
import {
  DataType, isDataType, isDefinitionType, isPropertyType, PropertyType
} from "../Setup/Enums"
import { Modes } from "../Setup/Modes"
import { colorBlack, colorBlackOpaque, colorValid } from "../Utility/Color"
import { isBoolean, isNumber, isNumeric, isPopulatedString } from "../Utility/Is"

export type ColorDataType = DataType.Rgb | DataType.Rgba

export const PropertyTypesNumeric = [
  DataType.Frame,
  DataType.Percent,
  DataType.Track,
  DataType.Direction4,
  DataType.Direction8,
  DataType.Number,
  DataType.Mode,
]

export const isPropertyTypeColor = (value: any): value is ColorDataType => {
  return isPropertyType(value) && value === DataType.Rgb || value === DataType.Rgba
}
export function assertPropertyTypeColor(value: any): asserts value is ColorDataType {
  if (!isPropertyTypeColor(value)) throw new Error("expected color PropertyType")
}

const propertyTypeRepresentedAsNumber = (dataType: PropertyType): boolean => {
  return isDataType(dataType) && PropertyTypesNumeric.includes(dataType)
}

export const propertyTypeIsString = (dataType: PropertyType): boolean => {
  if (dataType === DataType.Boolean) return false
  if (propertyTypeRepresentedAsNumber(dataType)) return false
  return true
}

export const propertyTypeDefault = (dataType: PropertyType): Scalar => {
  if (isDefinitionType(dataType)) return `${IdPrefix}${dataType}${IdSuffix}`

  switch (dataType) {
    case DataType.Boolean: return false
    case DataType.Rgb: return colorBlack
    case DataType.Rgba: return colorBlackOpaque
  }
  return propertyTypeRepresentedAsNumber(dataType) ? 0 : ''
}

const propertyTypeValidBoolean = (value: Scalar): boolean => {
  if (isBoolean(value)) return true
  if (isNumber(value)) return value === 0 || value === 1
  return ['true', 'false', ''].includes(value as string)
}

const propertyTypeValidNumber = (value: Scalar, max = 0): boolean => {
  if (!isNumeric(value)) return false
  if (!max) return true
  const number = Number(value)
  return number >= 0 && number <= max
}

export const propertyTypeValid = (value: Scalar, dataType: PropertyType): boolean => {
  if (isDefinitionType(dataType)) return isPopulatedString(value)

  switch (dataType) {
    case DataType.Boolean: return propertyTypeValidBoolean(value)
    case DataType.Rgb:
    case DataType.Rgba: return colorValid(String(value))
    case DataType.Direction4: return propertyTypeValidNumber(value, 4)
    case DataType.Direction8: return propertyTypeValidNumber(value, 8)
    case DataType.Frame:
    case DataType.Percent:
    case DataType.Number: return propertyTypeValidNumber(value)
    case DataType.Mode: return propertyTypeValidNumber(value, Modes.length - 1)
    case DataType.String: return true
    case DataType.ContainerId:
    case DataType.ContentId:
    case DataType.FontId:
    case DataType.DefinitionId: return isPopulatedString(value)
  }
  return false
}

export const propertyTypeCoerce = (value: Scalar, dataType: PropertyType): Scalar => {
  if (dataType === DataType.Boolean) {
    if (isBoolean(value)) return value as boolean
    if (isNumeric(value)) return !!Number(value)
    return value === 'true'
  }
  if (propertyTypeRepresentedAsNumber(dataType)) return isNumeric(value) ? Number(value) : 0
  return String(value)
}
