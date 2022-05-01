import { ScalarArray, UnknownObject } from "../declarations"

export const isObject = (value : unknown) : boolean => typeof value === 'object'

export const isString = (value : unknown) : boolean => (
  typeof value === 'string'
)

export const isUndefined = (value : unknown) : boolean => typeof value === 'undefined'

export const isNumber = (value : unknown) : boolean => typeof value === 'number'

export const isBoolean = (value : unknown) : boolean => typeof value === 'boolean'

export const isMethod = (value : unknown) : boolean => typeof value === 'function'

export const isDefined = (value : unknown) : boolean => !isUndefined(value)

export const isNan = (value : unknown) : boolean => isNumber(value) && Number.isNaN(value)

const isNotNan = (value : unknown) : boolean => isNumber(value) && !Number.isNaN(value)

export const isInteger = (value : unknown) : boolean => Number.isInteger(value)

export const isFloat = (value : unknown) : boolean => isNumber(value) && !isInteger(value)

export const isPositive = (value : unknown) : boolean => isNumber(value) && Number(value) >= 0

export const isAboveZero = (value : unknown) : boolean => isNotNan(value) && Number(value) > 0

export const isArray = (value : unknown) : boolean => (
  isDefined(Array.isArray) ? Array.isArray(value) : value instanceof Array
)

const length = (value : string | ScalarArray) : boolean => !!value.length

export const isPopulatedString = (value : unknown) : boolean => isString(value) && length(String(value))

export const isPopulatedObject = (value : unknown) : boolean => (
  isObject(value) && length(Object.keys(<UnknownObject> value))
)

export const isPopulatedArray = (value: unknown): boolean => isArray(value) && length(<ScalarArray>value)

export const isNumeric = (value: unknown): boolean => (
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
