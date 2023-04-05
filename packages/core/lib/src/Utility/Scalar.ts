import type { Scalar, Scalars, Strings } from '../Types/Core.js'
import { CommaChar } from '../Setup/Constants.js'

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

export type BooleanType = 'boolean'
export const TypeBoolean: BooleanType = 'boolean'

export type NumberType = 'number'
export const TypeNumber: NumberType = 'number'

export type StringType = 'string'
export const TypeString: StringType = 'string'

export type ScalarType = BooleanType | NumberType | StringType
