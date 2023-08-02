import type { Scalar, DataType, Strings } from '@moviemasher/runtime-shared'

import { isBoolean, isNumber, isNumeric, isPopulatedString } from '@moviemasher/runtime-shared'
import {
  DataTypeBoolean, DataTypeContainerId, DataTypeContentId,
  DataTypeFrame,
  DataTypeNumber, DataTypePercent, DataTypeRgb, DataTypeString
} from '../Setup/DataTypeConstants.js'
import { colorValid } from '../Helpers/Color/ColorFunctions.js'
import { colorBlack } from '../Helpers/Color/ColorConstants.js'
import { DefaultContainerId } from '../Helpers/Container/ContainerConstants.js'
import { DefaultContentId } from '../Helpers/Content/ContentConstants.js'

export const PropertyTypesNumeric: Strings = [
  DataTypeFrame, DataTypePercent, DataTypeNumber,
]

const propertyTypeRepresentedAsNumber = (dataType: DataType): boolean => {
  return PropertyTypesNumeric.includes(dataType)
}

export const propertyTypeIsString = (dataType: DataType): boolean => {
  if (dataType === DataTypeBoolean) return false
  if (propertyTypeRepresentedAsNumber(dataType)) return false
  return true
}

export const propertyTypeDefault = (dataType: DataType): Scalar => {
  switch (dataType) {
    case DataTypeContainerId: return DefaultContainerId
    case DataTypeContentId: return DefaultContentId
    case DataTypeBoolean: return false
    case DataTypeRgb: return colorBlack
  }
  return propertyTypeRepresentedAsNumber(dataType) ? 0 : ''
}

const propertyTypeValidBoolean = (value: Scalar): boolean => {
  if (isBoolean(value)) return true
  if (isNumber(value)) return value === 0 || value === 1
  return ['true', 'false', ''].includes(value as string)
}

export const propertyTypeValid = (value: Scalar, dataType: DataType): boolean => {
  switch (dataType) {
    case DataTypeBoolean: return propertyTypeValidBoolean(value)
    case DataTypeRgb: return colorValid(String(value))
    case DataTypeFrame:
    case DataTypePercent:
    case DataTypeNumber: return isNumeric(value)
    case DataTypeString: return true
    case DataTypeContainerId:
    case DataTypeContentId:
    default: return isPopulatedString(value)
  }
}

export const propertyTypeCoerce = (value: Scalar, dataType: DataType): Scalar => {
  if (dataType === DataTypeBoolean) {
    if (isBoolean(value)) return value as boolean
    if (isNumeric(value)) return !!Number(value)
    return value === 'true'
  }
  if (propertyTypeRepresentedAsNumber(dataType)) return isNumeric(value) ? Number(value) : 0
  return String(value)
}
