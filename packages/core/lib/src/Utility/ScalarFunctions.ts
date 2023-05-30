import type { Scalar, Scalars, Strings } from '@moviemasher/runtime-shared'
import { CommaChar } from '../Setup/Constants.js'
import { BooleanDataType, NumberDataType, StringDataType } from '@moviemasher/runtime-shared'
import { BooleanType, NumberType, StringType, ScalarType } from './ScalarTypes.js'

export function scalar(value: Scalar, type: BooleanType): boolean
export function scalar(value: Scalar, type: NumberType): number
export function scalar(value: Scalar, type: StringType): string
export function scalar(value: Scalar, type?: ScalarType): Scalar
export function scalar(value: Scalar, type?: ScalarType) {
  switch (type) {
    case TypeBoolean: return Boolean(value)
    case TypeNumber: return Number(value)
    case TypeString: return String(value)
  }
  return value
}

export function scalars(value: Scalar, type: StringType): Strings
export function scalars(value: Scalar, type: ScalarType): Scalars
export function scalars(value: Scalar, _?: ScalarType): Scalars {
  const stringValue = String(value)
  const split = stringValue.split(CommaChar)
  return split.filter(Boolean)

}

export type ScalarFunction = typeof scalar


export const TypeBoolean: BooleanDataType = 'boolean'
export const TypeNumber: NumberDataType = 'number'
export const TypeString: StringDataType = 'string'


