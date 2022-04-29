import { Scalar, UnknownObject } from "../declarations"
import { Errors } from "./Errors"
import { DataType, DataTypes } from "./Enums"
import { dataTypeDefault } from "../Helpers/DataType"
import { isBoolean, isNumber, isPopulatedString, isUndefined } from "../Utility/Is"

export interface PropertyObject {
  type? : DataType | string
  name? : string
  defaultValue? : Scalar
  custom? : boolean
}

export interface Property extends UnknownObject {
  custom?: boolean
  name: string
  type: DataType
  defaultValue: Scalar
  min?: number
  max?: number
  step?: number
}

const propertyType = (type?: DataType | string, value?: Scalar): DataType => {
  if (isUndefined(type)) {
    if (isBoolean(value)) return DataType.Boolean
    if (isNumber(value)) return DataType.Number
    return DataType.String
  }
  if (!isPopulatedString(type)) throw Errors.invalid.type

  const dataType = type as DataType
  if (!DataTypes.includes(dataType)) throw Errors.invalid.type + dataType

  return dataType
}

const propertyValue = (type: DataType, value?: Scalar): Scalar => {
  if (isUndefined(value)) return dataTypeDefault(type)

  return value!
}

export const propertyInstance = (object: PropertyObject):Property => {
  const { type, name, defaultValue, ...rest } = object
  const dataType = propertyType(type, defaultValue)
  const dataValue = propertyValue(dataType, defaultValue)
  const dataName = isPopulatedString(name) ? name! : dataType
  return { type: dataType, defaultValue: dataValue, name: dataName, ...rest }
}
