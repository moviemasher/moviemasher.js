import { Scalar } from "../declarations"
import { DataType } from "../Setup/Enums"
import { Modes } from "../Setup/Modes"
import { colorBlack, colorBlackOpaque, colorValid } from "../Utility/Color"
import { isBoolean, isNumber, isNumeric, isPopulatedString } from "../Utility/Is"

export const DataTypesDefinition = [
  DataType.Merger,
  DataType.Scaler,
  DataType.Font,
]
export const DataTypesNumeric = [
  DataType.Frame,
  DataType.Direction4,
  DataType.Direction8,
  DataType.Number,
  DataType.Mode,
]

export const DataTypeBooleans = ['true', 'false', '']

export const dataTypeRepresentedAsNumber = (dataType: DataType): boolean => {
  return DataTypesNumeric.includes(dataType)
}

export const dataTypeIsString = (dataType: DataType): boolean => {
  if (dataType === DataType.Boolean) return false
  if (dataTypeRepresentedAsNumber(dataType)) return false
  return true
}

export const dataTypeIsDefinitionId = (dataType: DataType): boolean => {
  return DataTypesDefinition.includes(dataType)
}

export const dataTypeDefault = (dataType: DataType): Scalar => {
  switch (dataType) {
    case DataType.Boolean: return false
    case DataType.Font: return 'com.moviemasher.font.default'
    case DataType.Merger: return 'com.moviemasher.merger.default'
    case DataType.Scaler: return 'com.moviemasher.scaler.default'
    case DataType.Rgb: return colorBlack
    case DataType.Rgba: return colorBlackOpaque
  }
  return dataTypeRepresentedAsNumber(dataType) ? 0 : ''
}

export const dataTypeValidBoolean = (value: Scalar): boolean => {
  if (isBoolean(value)) return true
  if (isNumber(value)) return value === 0 || value === 1
  return DataTypeBooleans.includes(value as string)
}

const dataTypeValidNumber = (value: Scalar, max = 0): boolean => {
  if (!isNumeric(value)) return false
  if (!max) return true
  const number = Number(value)
  return number >= 0 && number <= max
}

export const dataTypeValid = (value: Scalar, dataType: DataType): boolean => {
  switch (dataType) {
    case DataType.Boolean: return dataTypeValidBoolean(value)
    case DataType.Font:
    case DataType.Merger:
    case DataType.Scaler: return isPopulatedString(value)
    case DataType.Rgb:
    case DataType.Rgba: return colorValid(String(value))
    case DataType.Direction4: return dataTypeValidNumber(value, 4)
    case DataType.Direction8: return dataTypeValidNumber(value, 8)
    case DataType.Frame:
    case DataType.Number: return dataTypeValidNumber(value)
    case DataType.Mode: return dataTypeValidNumber(value, Modes.length - 1)
    case DataType.String: return true
  }
  return false
}

export const dataTypeCoerceBoolean = (value: Scalar): boolean => {
  if (isBoolean(value)) return value as boolean
  if (isNumeric(value)) return !!Number(value)
  return value === 'true'
}

export const dataTypeCoerceNumber = (value: Scalar): number => {
  return isNumeric(value) ? Number(value) : 0
}

export const dataTypeCoerce = (value: Scalar, dataType: DataType): Scalar => {
  if (dataType === DataType.Boolean) return dataTypeCoerceBoolean(value)
  if (dataTypeRepresentedAsNumber(dataType)) return dataTypeCoerceNumber(value)
  return String(value)
}
