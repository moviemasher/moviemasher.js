const objectType = value => typeof value === 'object'
const stringType = value => typeof value === 'string'
const undefinedType = value => typeof value === 'undefined'
const numberType = value => typeof value === 'number'
const booleanType = value => typeof value === 'boolean'
const methodType = value => typeof value === 'function'

const isDefined = value => !undefinedType(value)
const isNil = value => value === null
const isNot = value => undefinedType(value) || isNil(value)

const isNan = value => numberType(value) && Number.isNaN(value)
const isNumber = value => numberType(value) && !Number.isNaN(value)
const isInt = value => Number.isInteger(value)
const isFloat = value => numberType(value) && !isInt(value)
const isPositive = value => isNumber(value) && value >= 0
const isAboveZero = value => isNumber(value) && value > 0

const instanceOf = (value, klass) => objectType(value) && value instanceof klass
const isArray = value => (
  isDefined(Array.isArray) ? Array.isArray(value) : instanceOf(value, Array)
)

const length = value => !!value.length

const emptystring = value => isNot(value) || !stringType(value) || !length(value)
const emptyarray = value => isNot(value) || !isArray(value) || !length(value)
const emptyobject = value => (
  isNot(value) || !objectType(value) || !length(Object.keys(value))
)

const empty = value => {
  if (isNot(value)) return true
  if (isArray(value)) return emptyarray(value)
  if (stringType(value)) return emptystring(value)

  return emptyobject(value)
}

const objectStrict = value => objectType(value) && !(isNot(value) || isArray(value))

const Is = {
  empty,
  emptyarray,
  emptyobject,
  emptystring,
  float: isFloat,
  object: objectType,
  undefined: undefinedType,
  boolean: booleanType,
  number: numberType,
  integer: isInt,
  string: stringType,
  array: isArray,
  instanceOf,
  defined: isDefined,
  method: methodType,
  nan: isNan,
  nil: isNil,
  not: isNot,
  objectStrict,
  positive: isPositive,
  aboveZero: isAboveZero,
}

export {
  Is,
  objectType,
  undefinedType,
  booleanType,
  numberType,
  stringType,
  methodType,
  empty,
  emptyarray,
  emptyobject,
  emptystring,
  isFloat,
  isInt,
  isArray,
  instanceOf,
  isDefined,
  isNan,
  isNil,
  isNot,
  objectStrict,
  isPositive,
  isAboveZero,
}
