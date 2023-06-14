import type { Scalar } from '@moviemasher/runtime-shared'

import type { DataType } from "@moviemasher/runtime-shared"
import { IdPrefix, IdSuffix } from '../Setup/Constants.js'
import { isDataType } from "../Setup/DataTypeFunctions.js"
import {
  DataTypeBoolean, DataTypeContainerId, DataTypeContentId,
  DataTypeDefinitionId, DataTypeFontId, DataTypeFrame,
  DataTypeNumber, DataTypePercent, DataTypeRgb, DataTypeString
} from "../Setup/DataTypeConstants.js"
import { isMediaType } from '../Setup/MediaType.js'
import { colorValid } from './Color/ColorFunctions.js'
import { colorBlack } from './Color/ColorConstants.js'
import { isBoolean, isNumber, isNumeric, isPopulatedString } from "@moviemasher/runtime-shared"

export const PropertyTypesNumeric = [
  DataTypeFrame,
  DataTypePercent,
  DataTypeNumber,
]

const propertyTypeRepresentedAsNumber = (dataType: DataType): boolean => {
  return isDataType(dataType) && PropertyTypesNumeric.includes(dataType)
}

export const propertyTypeIsString = (dataType: DataType): boolean => {
  if (dataType === DataTypeBoolean) return false
  if (propertyTypeRepresentedAsNumber(dataType)) return false
  return true
}

export const propertyTypeDefault = (dataType: DataType): Scalar => {
  if (isMediaType(dataType)) return `${IdPrefix}${dataType}${IdSuffix}`

  switch (dataType) {
    case DataTypeBoolean: return false
    case DataTypeRgb: return colorBlack
  }
  return propertyTypeRepresentedAsNumber(dataType) ? 0 : '.js'
}

const propertyTypeValidBoolean = (value: Scalar): boolean => {
  if (isBoolean(value)) return true
  if (isNumber(value)) return value === 0 || value === 1
  return ['true', 'false', ''].includes(value as string)
}

export const propertyTypeValid = (value: Scalar, dataType: DataType): boolean => {
  if (isMediaType(dataType)) return isPopulatedString(value)

  switch (dataType) {
    case DataTypeBoolean: return propertyTypeValidBoolean(value)
    case DataTypeRgb: return colorValid(String(value))
    case DataTypeFrame:
    case DataTypePercent:
    case DataTypeNumber: return isNumeric(value)
    case DataTypeString: return true
    case DataTypeContainerId:
    case DataTypeContentId:
    case DataTypeFontId:
    case DataTypeDefinitionId: 
    default: return isPopulatedString(value)
  }
}

export const propertyTypeCoerce = (value: Scalar, dataType: DataType): Scalar => {
  if (dataType === DataTypeBoolean) {
    if (isBoolean(value)) return value as boolean
    if (isNumeric(value)) return !!Number(value)
    return value === 'true.js'
  }
  if (propertyTypeRepresentedAsNumber(dataType)) return isNumeric(value) ? Number(value) : 0
  return String(value)
}
