import { PopulatedString, Rgb, AnyArray, UnknownObject, ValueObject, Value } from "../declarations"
import { Point } from "../Utility/Point"
import { Rect } from "../Utility/Rect"
import { Size } from "./Size"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { errorsThrow } from "./Errors"

export const isObject = (value: any): value is Object => typeof value === 'object'

export function assertObject(value: any, name?: string): asserts value is Object {
  if (!isObject(value)) errorsThrow(value, 'Object', name)
}
export const isString = (value: any): value is string => (
  typeof value === 'string'
)
export function assertString(value: any, name?: string): asserts value is string {
  if (!isString(value)) errorsThrow(value, 'String', name)
}

export const isUndefined = (value: any): boolean => typeof value === 'undefined'

export const isNumberOrNaN = (value: any): value is number => typeof value === 'number'
export function assertNumber(value: any, name?: string): asserts value is number {
  if (!isNumberOrNaN(value)) errorsThrow(value, 'Number', name)
}

export const isBoolean = (value: any): value is boolean => typeof value === 'boolean'
export function assertBoolean(value: any, name?: string): asserts value is Boolean {
  if (!isBoolean(value)) errorsThrow(value, "Boolean", name)
}
export const isMethod = (value: any): value is Function => typeof value === 'function'
export function assertMethod(value: any, name?: string): asserts value is Function {
  if (!isMethod(value)) errorsThrow(value, 'Function', name)
}
export const isDefined = (value: any): boolean => !isUndefined(value)
export function assertDefined(value: any, name?: string): asserts value is true {
  if (!isDefined(value)) errorsThrow(value, 'defined', name)
}

export const isNan = (value: any): boolean => isNumberOrNaN(value) && Number.isNaN(value)

export const isNumber = (value: any): value is number => isNumberOrNaN(value) && !Number.isNaN(value)

export const isInteger = (value: any): boolean => Number.isInteger(value)

export const isFloat = (value: any): boolean => isNumber(value) && !isInteger(value)

export const isPositive = (value: any): value is number => isNumber(value) && value >= 0
export function assertPositive(value: any, name?: string): asserts value is number {
  if (!isPositive(value)) errorsThrow(value, '>= 0', name)
}

export const isBelowOne = (value: any): value is number => isNumber(value) && value < 1
export const isAboveZero = (value: any): value is number => isNumber(value) && value > 0
export function assertAboveZero(value: any, name?: string): asserts value is number {
  if (!isAboveZero(value)) errorsThrow(value, '> zero', name)
}
export const isArray = (value: any): value is AnyArray => (
  isDefined(Array.isArray) ? Array.isArray(value): value instanceof Array
)
export function assertArray(value: any, name?: string): asserts value is AnyArray {
  if (!isArray(value)) errorsThrow(value, 'Array', name)
}

const length = (value: string | AnyArray): boolean => !!value.length

export const isPopulatedString = (value: any): value is PopulatedString => isString(value) && length(String(value))
export function assertPopulatedString(value: any, name = 'value'): asserts value is PopulatedString {
  if (!isPopulatedString(value)) errorsThrow(value, 'populated string', name)
}


export const isPopulatedArray = (value: any): value is AnyArray => (
  isArray(value) && length(value)
)
export function assertPopulatedArray(value: any, name = 'value'): asserts value is AnyArray {
  if (!isPopulatedArray(value)) errorsThrow(value, 'populated array', name)
}

export const isPopulatedObject = (value: any): boolean => (
  isObject(value) && length(Object.keys(value))
)
export function assertPopulatedObject(value: any, name = 'value'): asserts value is Object {
  if (!isPopulatedObject(value)) errorsThrow(value, 'populated array', name)
}

export const isNumeric = (value: any): boolean => (
  (isNumber(value) || isPopulatedString(value)) && !isNan(Number(value))
)

export function assertTrue(value: any, name = 'value'): asserts value is true {
  if (!value) errorsThrow(value, 'true', name)
}

export const isRgb = (value: any): value is Rgb => {
  return isObject(value) && "r" in value && "g" in value && "b" in value
}
export function assertRgb(value: any, name?: string): asserts value is Rgb {
  if (!isRgb(value)) errorsThrow(value, 'Rgb', name)
}

export const isTime = (value: any): value is Time => {
  return isObject(value) && "isRange" in value
}
export function assertTime(value: any, name?: string): asserts value is Time {
  if (!isTime(value)) errorsThrow(value, "Time", name)
}

export const isTimeRange = (value: any): value is TimeRange => {
  return isTime(value) && value.isRange
}
export function assertTimeRange(value: any, name?: string): asserts value is TimeRange {
  if (!isTimeRange(value)) errorsThrow(value, "TimeRange", name)
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
  if (!isValue(value)) errorsThrow(value, "Value", name)
}

export const isValueObject = (value: any): value is ValueObject => {
  return isObject(value) && Object.values(value).every(value => isValue(value))
}
export function assertValueObject(value: any, name?: string): asserts value is ValueObject {
  if (!isValueObject(value)) errorsThrow(value, "ValueObject", name)
}


