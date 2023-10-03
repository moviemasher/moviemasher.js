import type { BooleanType, NumberType, Scalar, ScalarType, Scalars, StringType, Strings } from '@moviemasher/runtime-shared'

import { BOOLEAN, NUMBER, STRING } from '@moviemasher/runtime-shared'
import { COMMA } from '../Setup/Constants.js'

export function scalar(value: Scalar, type: BooleanType): boolean
export function scalar(value: Scalar, type: NumberType): number
export function scalar(value: Scalar, type: StringType): string
export function scalar(value: Scalar, type?: ScalarType): Scalar
export function scalar(value: Scalar, type?: ScalarType) {
  switch (type) {
    case BOOLEAN: return Boolean(value)
    case NUMBER: return Number(value)
    case STRING: return String(value)
  }
  return value
}

export type ScalarFunction = typeof scalar

export function scalars(value: Scalar, type: StringType): Strings
export function scalars(value: Scalar, type: ScalarType): Scalars
export function scalars(value: Scalar, _?: ScalarType): Scalars {
  const stringValue = String(value)
  const split = stringValue.split(COMMA)
  return split.filter(Boolean)
}
