import type { Integer, JsonRecord, JsonRecords, NestedStringRecord, PopulatedString, PropertyId, Scalar, ScalarRecord, StringRecord, Unknowns, Value, ValueRecord } from '@moviemasher/runtime-shared'
import type { Rgb } from '../Helpers/Color/ColorTypes.js'

import { TARGET_IDS, errorThrow, isArray, isBoolean, isDefined, isNumber, isNumberOrNaN, isNumeric, isObject, isPopulatedString, isString, length } from '@moviemasher/runtime-shared'
import { isRgb } from './RgbGuards.js'

export function isPopulatedArray<T = unknown>(value: any): value is T[] {
  return isArray<T>(value) && length(value)
}

export const isInteger = (value: any): value is Integer => isNumber(value) && Number.isInteger(value)
export const isFloat = (value: any): boolean => isNumber(value) && !isInteger(value)
export const isPositive = (value: any): value is number => isNumber(value) && value >= 0
export const isBelowOne = (value: any): value is number => isNumber(value) && value < 1
export const isAboveZero = (value: any): value is number => isNumber(value) && value > 0

export const isValue = (value: any): value is Value => {
  return isNumber(value) || isString(value)
}

export const isScalar = (value: any): value is Scalar => (
  isBoolean(value) || isValue(value)
)

export const isTrueValue = (value: any): value is Value => {
  if (!isValue(value)) return false

  if (isNumeric(value)) return !!Number(value)

  return isPopulatedString(value)
}

export const isValueRecord = (value: any): value is ValueRecord => {
  return isObject(value) && Object.values(value).every(value => isValue(value))
}

export const isScalarRecord = (value: any): value is ScalarRecord => {
  return isObject(value) && Object.values(value).every(value => isScalar(value))
}
export const isStringRecord = (value: any): value is StringRecord => {
  return isObject(value) && Object.values(value).every(value => isString(value))
}

export const isJsonRecord = (value: any): value is JsonRecord => (
  isObject(value) && !('error' in value)
)
export const isJsonRecords = (value: any): value is JsonRecords => (
  isArray(value)
)

export const isNestedStringRecord = (value: any): value is NestedStringRecord => {
  return isObject(value) && Object.values(value).every(value => (
    isStringRecord(value) || isNestedStringRecord(value)
  ))
}

export function assertObject(value: any, name?: string): asserts value is object {
  if (!isObject(value)) errorThrow(value, 'Object', name)
}

export function assertString(value: any, name?: string): asserts value is string {
  if (!isString(value)) errorThrow(value, 'String', name)
}


export function assertNumber(value: any, name?: string): asserts value is number {
  if (!isNumberOrNaN(value)) errorThrow(value, 'Number', name)
}

export function assertBoolean(value: any, name?: string): asserts value is boolean {
  if (!isBoolean(value)) errorThrow(value, 'Boolean', name)
}

export function assertDefined<T=true>(value: any, name?: string): asserts value is T {
  if (!isDefined<T>(value)) errorThrow(value, 'Defined', name)
}

export function assertInteger(value: any, name?: string): asserts value is Integer {
  if (!isInteger(value)) errorThrow(value, 'Integer', name)
}

export function assertPositive(value: any, name?: string): asserts value is number {
  if (!isPositive(value)) errorThrow(value, '>= 0', name)
}

export function assertAboveZero(value: any, name?: string): asserts value is number {
  if (!isAboveZero(value)) errorThrow(value, '> zero', name)
}

export function assertArray<T = unknown>(value: any, name?: string): asserts value is T[] {
  if (!isArray(value)) errorThrow(value, 'Array', name)
}

export function assertPopulatedString(value: any, name = 'value'): asserts value is PopulatedString {
  if (!isPopulatedString(value)) errorThrow(value, 'populated string', name)
}

export function assertPopulatedArray(value: any, name = 'value'): asserts value is Unknowns {
  if (!isPopulatedArray(value)) errorThrow(value, 'populated array', name)
}

export function assertTrue(value: any, name = 'value'): asserts value is true {
  if (!value) errorThrow(value, 'true', name)
}

export function assertRgb(value: any, name?: string): asserts value is Rgb {
  if (!isRgb(value)) errorThrow(value, 'Rgb', name)
}

export function assertValue(value: any, name?: string): asserts value is Value {
  if (!isValue(value)) errorThrow(value, 'Value', name)
}

export function assertValueRecord(value: any, name?: string): asserts value is ValueRecord {
  if (!isValueRecord(value)) errorThrow(value, 'ValueRecord', name)
}

export function assertScalar(value: any, name?: string): asserts value is Scalar {
  if (!isScalar(value)) errorThrow(value, 'Scalar', name)
}

export const isPropertyId = (value: any): value is PropertyId => (
  isPopulatedString(value) 
    && TARGET_IDS.some(type => value.startsWith(type))
    && value.split('.').length === 2
)
