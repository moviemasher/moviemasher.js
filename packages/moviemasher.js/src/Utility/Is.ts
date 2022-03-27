import { ScalarArray, UnknownObject } from "../declarations"

const objectType = (value : unknown) : boolean => typeof value === 'object'

const isString = (value : unknown) : boolean => (
  typeof value === 'string'
)

const isUndefined = (value : unknown) : boolean => typeof value === 'undefined'

const numberType = (value : unknown) : boolean => typeof value === 'number'

const booleanType = (value : unknown) : boolean => typeof value === 'boolean'

const methodType = (value : unknown) : boolean => typeof value === 'function'

const isDefined = (value : unknown) : boolean => !isUndefined(value)

const isNan = (value : unknown) : boolean => numberType(value) && Number.isNaN(value)

const isNumber = (value : unknown) : boolean => numberType(value) && !Number.isNaN(value)

const isInteger = (value : unknown) : boolean => Number.isInteger(value)

const isFloat = (value : unknown) : boolean => numberType(value) && !isInteger(value)

const isPositive = (value : unknown) : boolean => numberType(value) && Number(value) >= 0

const isAboveZero = (value : unknown) : boolean => isNumber(value) && Number(value) > 0

const isArray = (value : unknown) : boolean => (
  isDefined(Array.isArray) ? Array.isArray(value) : value instanceof Array
)

const length = (value : string | ScalarArray) : boolean => !!value.length

const isPopulatedString = (value : unknown) : boolean => isString(value) && length(String(value))

const isPopulatedObject = (value : unknown) : boolean => (
  objectType(value) && length(Object.keys(<UnknownObject> value))
)

const isPopulatedArray = (value: unknown): boolean => isArray(value) && length(<ScalarArray>value)

const isNumeric = (value: unknown): boolean => isNumber(value) || !isNan(Number(value))
/**
 * @category Utility
 */
const Is = {
  aboveZero: isAboveZero,
  array: isArray,
  boolean: booleanType,
  defined: isDefined,
  float: isFloat,
  integer: isInteger,
  method: methodType,
  nan: isNan,
  number: numberType,
  object: objectType,
  populatedArray: isPopulatedArray,
  populatedObject: isPopulatedObject,
  populatedString: isPopulatedString,
  positive: isPositive,
  string: isString,
  undefined: isUndefined,
}

export {
  Is,
  isAboveZero,
  isArray,
  booleanType as isBoolean,
  isDefined,
  isFloat,
  isInteger,
  methodType as isMethod,
  isNan,
  numberType as isNumber,
  objectType as isObject,
  isPopulatedArray,
  isPopulatedObject,
  isPopulatedString,
  isPositive,
  isString,
  isUndefined,
  isNumeric,
}
