import { PopulatedString, ScalarArray, UnknownObject } from "../declarations"

export const isObject = (value: any) : boolean => typeof value === 'object'

export const isString = (value: any) : value is string => (
  typeof value === 'string'
)
export function assertString(value: any): asserts value is string {
  if (!isString(value)) throw new Error("expected string")
}

export const isUndefined = (value: any) : boolean => typeof value === 'undefined'

export const isNumber = (value: any) : value is number => typeof value === 'number'

export const isBoolean = (value: any) : value is boolean => typeof value === 'boolean'

export const isMethod = (value: any) : boolean => typeof value === 'function'

export const isDefined = (value: any) : boolean => !isUndefined(value)

export const isNan = (value: any) : boolean => isNumber(value) && Number.isNaN(value)

const isNotNan = (value: any) : boolean => isNumber(value) && !Number.isNaN(value)

export const isInteger = (value: any) : boolean => Number.isInteger(value)

export const isFloat = (value: any) : boolean => isNumber(value) && !isInteger(value)

export const isPositive = (value: any) : value is number => isNumber(value) && Number(value) >= 0

export const isAboveZero = (value: any) : boolean => isNotNan(value) && Number(value) > 0

export const isArray = (value: any) : boolean => (
  isDefined(Array.isArray) ? Array.isArray(value) : value instanceof Array
)

const length = (value : string | ScalarArray) : boolean => !!value.length

export const isPopulatedString = (value: any) : value is PopulatedString => isString(value) && length(String(value))
export function assertPopulatedString(value: any): asserts value is PopulatedString {
  if (!isPopulatedString(value)) throw new Error("expected PopulatedString")
}

export const isPopulatedObject = (value: any) : boolean => (
  isObject(value) && length(Object.keys(<UnknownObject> value))
)

export const isPopulatedArray = (value: any): boolean => isArray(value) && length(<ScalarArray>value)

export const isNumeric = (value: any): boolean => (
  (isNotNan(value) || isPopulatedString(value)) && !isNan(Number(value))
)


/**
 * @category Utility
 */
export const Is = {
  aboveZero: isAboveZero,
  array: isArray,
  boolean: isBoolean,
  defined: isDefined,
  float: isFloat,
  integer: isInteger,
  method: isMethod,
  nan: isNan,
  number: isNumber,
  object: isObject,
  populatedArray: isPopulatedArray,
  populatedObject: isPopulatedObject,
  populatedString: isPopulatedString,
  positive: isPositive,
  string: isString,
  undefined: isUndefined,
}
