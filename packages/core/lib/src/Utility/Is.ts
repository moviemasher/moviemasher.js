import type { DefiniteError } from '../Helpers/Error/Error.js'
import type { PopulatedString, Unknowns, ValueRecord, Value, JsonRecord, Integer, JsonRecords, Scalar, StringRecord, NestedStringRecord, ScalarRecord } from '../Types/Core.js'
import type { Rgb } from '../Helpers/Color/Color.js'
import type { Time, TimeRange } from '../Helpers/Time/Time.js'
import type { UnknownFunction } from '../Setup/Constants.js'

import { errorThrow } from '../Helpers/Error/ErrorFunctions.js'

export const isObject = (value: any): value is object => typeof value === 'object' 

export function assertObject(value: any, name?: string): asserts value is object {
  if (!isObject(value)) errorThrow(value, 'Object', name)
}
export const isString = (value: any): value is string => (
  typeof value === 'string'
)
export function assertString(value: any, name?: string): asserts value is string {
  if (!isString(value)) errorThrow(value, 'String', name)
}

export const isUndefined = (value: any): boolean => typeof value === 'undefined'

export const isNumberOrNaN = (value: any): value is number => typeof value === 'number'
export function assertNumber(value: any, name?: string): asserts value is number {
  if (!isNumberOrNaN(value)) errorThrow(value, 'Number', name)
}

export const isBoolean = (value: any): value is boolean => typeof value === 'boolean'
export function assertBoolean(value: any, name?: string): asserts value is boolean {
  if (!isBoolean(value)) errorThrow(value, 'Boolean', name)
}
export const isFunction = (value: any): value is UnknownFunction => typeof value === 'function'
export function assertFunction(value: any, name?: string): asserts value is UnknownFunction {
  if (!isFunction(value)) errorThrow(value, 'Method', name)
}
export const isDefined = (value: any): boolean => !isUndefined(value)
export function assertDefined(value: any, name?: string): asserts value is true {
  if (!isDefined(value)) errorThrow(value, 'Defined', name)
}

export const isNan = (value: any): boolean => isNumberOrNaN(value) && Number.isNaN(value)

export const isNumber = (value: any): value is number => isNumberOrNaN(value) && !Number.isNaN(value)

export const isInteger = (value: any): value is Integer => Number.isInteger(value)
export function assertInteger(value: any, name?: string): asserts value is Integer {
  if (!isInteger(value)) errorThrow(value, 'Integer', name)
}

export const isFloat = (value: any): boolean => isNumber(value) && !isInteger(value)

export const isPositive = (value: any): value is number => isNumber(value) && value >= 0
export function assertPositive(value: any, name?: string): asserts value is number {
  if (!isPositive(value)) errorThrow(value, '>= 0', name)
}

export const isBelowOne = (value: any): value is number => isNumber(value) && value < 1
export const isAboveZero = (value: any): value is number => isNumber(value) && value > 0
export function assertAboveZero(value: any, name?: string): asserts value is number {
  if (!isAboveZero(value)) errorThrow(value, '> zero', name)
}
export function isArray<T = unknown>(value: any): value is T[] {
  return Array.isArray(value)
}

export function assertArray<T = unknown>(value: any, name?: string): asserts value is T[] {
  if (!isArray(value)) errorThrow(value, 'Array', name)
}

const length = (value: string | Unknowns): boolean => !!value.length

export const isPopulatedString = (value: any): value is PopulatedString => isString(value) && length(String(value))
export function assertPopulatedString(value: any, name = 'value'): asserts value is PopulatedString {
  if (!isPopulatedString(value)) errorThrow(value, 'populated string', name)
}


export const isPopulatedArray = (value: any): value is Unknowns => (
  isArray(value) && length(value)
)
export function assertPopulatedArray(value: any, name = 'value'): asserts value is Unknowns {
  if (!isPopulatedArray(value)) errorThrow(value, 'populated array', name)
}

export const isPopulatedObject = (value: any): boolean => (
  isObject(value) && length(Object.keys(value))
)
export function assertPopulatedObject(value: any, name = 'value'): asserts value is object {
  if (!isPopulatedObject(value)) errorThrow(value, 'populated array', name)
}

export const isNumeric = (value: any): boolean => (
  (isNumber(value) || isPopulatedString(value)) && !isNan(Number(value))
)

export function assertTrue(value: any, name = 'value'): asserts value is true {
  if (!value) errorThrow(value, 'true', name)
}

export const isRgb = (value: any): value is Rgb => {
  return isObject(value) && 'r' in value && 'g' in value && 'b' in value
}
export function assertRgb(value: any, name?: string): asserts value is Rgb {
  if (!isRgb(value)) errorThrow(value, 'Rgb', name)
}

export const isTime = (value: any): value is Time => {
  return isObject(value) && 'isRange' in value
}
export function assertTime(value: any, name?: string): asserts value is Time {
  if (!isTime(value)) errorThrow(value, 'Time', name)
}

export const isTimeRange = (value: any): value is TimeRange => {
  return isTime(value) && value.isRange
}
export function assertTimeRange(value: any, name?: string): asserts value is TimeRange {
  if (!isTimeRange(value)) errorThrow(value, 'TimeRange', name)
}

export const isValue = (value: any): value is Value => {
  return isNumber(value) || isString(value)
}
export const isTrueValue = (value: any): value is Value => {
  if (!isValue(value)) return false

  if (isNumeric(value)) return !!Number(value)

  return isPopulatedString(value)
}

export function assertValue(value: any, name?: string): asserts value is Value {
  if (!isValue(value)) errorThrow(value, 'Value', name)
}

export const isValueRecord = (value: any): value is ValueRecord => {
  return isObject(value) && Object.values(value).every(value => isValue(value))
}
export function assertValueRecord(value: any, name?: string): asserts value is ValueRecord {
  if (!isValueRecord(value)) errorThrow(value, 'ValueRecord', name)
}

export const isJsonRecord = (value: any): value is JsonRecord => (
  isObject(value) && !('error' in value)
)
export const isJsonRecords = (value: any): value is JsonRecords => (
  isArray(value)
)

export const isDefiniteError = (value: any): value is DefiniteError => {
  return isObject(value) && 'error' in value && isObject(value.error)
}

export const isScalar = (value: any): value is Scalar => (
  isBoolean(value) || isValue(value)
)

export function assertScalar(value: any, name?: string): asserts value is Scalar {
  if (!isScalar(value)) errorThrow(value, 'Scalar', name)
}


export const isScalarRecord = (value: any): value is ScalarRecord => {
  return isObject(value) && Object.values(value).every(value => isScalar(value))
}
export const isStringRecord = (value: any): value is StringRecord => {
  return isObject(value) && Object.values(value).every(value => isString(value))
}

export const isNestedStringRecord = (value: any): value is NestedStringRecord => {
  return isObject(value) && Object.values(value).every(value => (
    isStringRecord(value) || isNestedStringRecord(value)
  ))
}