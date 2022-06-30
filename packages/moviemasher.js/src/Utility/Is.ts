import { Point, PopulatedString, Rgb, AnyArray, UnknownObject, Rect, ValueObject, Value } from "../declarations"
import { Dimensions } from "../Setup/Dimensions"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { Size } from "../Setup/Enums"

export const isObject = (value: any): value is Object => typeof value === 'object'

export function assertObject(value: any, name?: string): asserts value is Object {
  if (!isObject(value)) throwError(value, 'Object', name)
}
export const isString = (value: any): value is string => (
  typeof value === 'string'
)
export function assertString(value: any, name?: string): asserts value is string {
  if (!isString(value)) throwError(value, 'String', name)
}

export const isUndefined = (value: any): boolean => typeof value === 'undefined'

export const isNumberOrNaN = (value: any): value is number => typeof value === 'number'
export function assertNumber(value: any, name?: string): asserts value is number {
  if (!isNumberOrNaN(value)) throwError(value, 'Number', name)
}

export const isBoolean = (value: any): value is boolean => typeof value === 'boolean'

export const isMethod = (value: any): boolean => typeof value === 'function'

export const isDefined = (value: any): boolean => !isUndefined(value)

export const isNan = (value: any): boolean => isNumberOrNaN(value) && Number.isNaN(value)

export const isNumber = (value: any): value is number => isNumberOrNaN(value) && !Number.isNaN(value)

export const isInteger = (value: any): boolean => Number.isInteger(value)

export const isFloat = (value: any): boolean => isNumber(value) && !isInteger(value)

export const isPositive = (value: any): value is number => isNumber(value) && value >= 0
export function assertPositive(value: any, name?: string): asserts value is number {
  if (!isPositive(value)) throwError(value, '>= 0', name)
}

export const isBelowOne = (value: any): value is number => isNumber(value) && value < 1
export const isAboveZero = (value: any): value is number => isNumber(value) && value > 0
export function assertAboveZero(value: any, name?: string): asserts value is number {
  if (!isAboveZero(value)) throwError(value, '> zero', name)
}
export const isArray = (value: any): value is AnyArray => (
  isDefined(Array.isArray) ? Array.isArray(value): value instanceof Array
)
export function assertArray(value: any, name?: string): asserts value is number {
  if (!isArray(value)) throwError(value, 'Array', name)
}

const length = (value: string | AnyArray): boolean => !!value.length

export const isPopulatedString = (value: any): value is PopulatedString => isString(value) && length(String(value))
export function assertPopulatedString(value: any, name = 'value'): asserts value is PopulatedString {
  if (!isPopulatedString(value)) throwError(value, 'populated string', name)
}


export const isPopulatedArray = (value: any): value is AnyArray => (
  isArray(value) && length(value)
)
export function assertPopulatedArray(value: any, name = 'value'): asserts value is AnyArray {
  if (!isPopulatedArray(value)) throwError(value, 'populated array', name)
}

export const isPopulatedObject = (value: any): boolean => (
  isObject(value) && length(Object.keys(value))
)

export const isNumeric = (value: any): boolean => (
  (isNumber(value) || isPopulatedString(value)) && !isNan(Number(value))
)

export function assertTrue(value: any, name = 'value'): asserts value is true {
  if (!value) throwError(value, 'true', name)
}

export const isRgb = (value: any): value is Rgb => {
  return isObject(value) && "r" in value && "g" in value && "b" in value
}
export function assertRgb(value: any, name?: string): asserts value is Rgb {
  if (!isRgb(value)) throwError(value, 'Rgb', name)
}

export const isPoint = (value: any): value is Point => {
  return isObject(value) && isNumber(value.x) && isNumber(value.y) 
}
export function assertPoint(value: any, name?: string): asserts value is Point {
  if (!isPoint(value)) throwError(value, 'Point', name)
}
export const isDimensions = (value: any): value is Dimensions => {
  return isObject(value) && isNumber(value.width) && isNumber(value.height) 
}
export function assertDimensions(value: any, name?: string): asserts value is Dimensions {
  if (!isDimensions(value)) throwError(value, 'Dimensions', name)
}
export const isRect = (value: any): value is Rect => {
  return isDimensions(value) && isPoint(value) 
}
export function assertRect(value: any, name?: string): asserts value is Rect {
  if (!isRect(value)) throwError(value, 'Rect', name)
}

export const isTime = (value: any): value is Time => {
  return isObject(value) && "isRange" in value
}

export const isTimeRange = (value: any): value is TimeRange => {
  return isTime(value) && value.isRange
}

export const isValue = (value: any): value is Value => {
  return isNumber(value) || isString(value)
}
export function assertValue(value: any, name?: string): asserts value is Value {
  if (!isValue(value)) throwError(value, "Value", name)
}

export const isValueObject = (value: any): value is ValueObject => {
  return isObject(value) && Object.values(value).every(value => isValue(value))
}
export function assertValueObject(value: any, name?: string): asserts value is ValueObject {
  if (!isValueObject(value)) throwError(value, "ValueObject", name)
}

export const throwError = (value: any, expected: string, name = "value") => {
  const type = typeof value
  const typeName = type === 'object' ? value.constructor.name: type
  console.error("throwError", value)
  throw new Error(`${name} is ${value} (${typeName}) instead of ${expected}`)
}

