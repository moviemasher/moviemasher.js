import { Scalar } from "../declarations"
import { IdPrefix, IdSuffix } from "../Setup/Constants"
import {
  DataType, isDataType, isMediaType
} from "../Setup/Enums"
import { colorBlack, colorValid } from "./Color/ColorFunctions"
import { isBoolean, isNumber, isNumeric, isPopulatedString } from "../Utility/Is"

export const PropertyTypesNumeric = [
  DataType.Frame,
  DataType.Percent,
  DataType.Number,
]

const propertyTypeRepresentedAsNumber = (dataType: DataType): boolean => {
  return isDataType(dataType) && PropertyTypesNumeric.includes(dataType)
}

export const propertyTypeIsString = (dataType: DataType): boolean => {
  if (dataType === DataType.Boolean) return false
  if (propertyTypeRepresentedAsNumber(dataType)) return false
  return true
}

export const propertyTypeDefault = (dataType: DataType): Scalar => {
  if (isMediaType(dataType)) return `${IdPrefix}${dataType}${IdSuffix}`

  switch (dataType) {
    case DataType.Boolean: return false
    case DataType.Rgb: return colorBlack
  }
  return propertyTypeRepresentedAsNumber(dataType) ? 0 : ''
}

const propertyTypeValidBoolean = (value: Scalar): boolean => {
  if (isBoolean(value)) return true
  if (isNumber(value)) return value === 0 || value === 1
  return ['true', 'false', ''].includes(value as string)
}

export const propertyTypeValid = (value: Scalar, dataType: DataType): boolean => {
  if (isMediaType(dataType)) return isPopulatedString(value)

  switch (dataType) {
    case DataType.Boolean: return propertyTypeValidBoolean(value)
    case DataType.Rgb: return colorValid(String(value))
    case DataType.Frame:
    case DataType.Percent:
    case DataType.Number: return isNumeric(value)
    case DataType.String: return true
    case DataType.ContainerId:
    case DataType.ContentId:
    case DataType.FontId:
    case DataType.DefinitionId: 
    default: return isPopulatedString(value)
  }
  return false
}

export const propertyTypeCoerce = (value: Scalar, dataType: DataType): Scalar => {
  if (dataType === DataType.Boolean) {
    if (isBoolean(value)) return value as boolean
    if (isNumeric(value)) return !!Number(value)
    return value === 'true'
  }
  if (propertyTypeRepresentedAsNumber(dataType)) return isNumeric(value) ? Number(value) : 0
  return String(value)
}
