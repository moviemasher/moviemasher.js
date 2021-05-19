const array = value => {
  if (defined(Array.isArray)) return Array.isArray(value)

  return instance(value, Array) 
}
const method = value => typeof value === 'function'

const object = value => typeof value === 'object'
const string = value => typeof value === 'string'
const undefined = value => typeof value === 'undefined'
const number = value => typeof value === 'number'
const boolean = value => typeof value === 'boolean'
const integer = value => Number.isInteger(value)
const length = value => !!value.length
const nil = value => value === null
const not = value => undefined(value) || nil(value)

const empty = value => {
  if (not(value)) return true
  if (array(value)) return emptyarray(value)
  if (string(value)) return emptystring(value)
  
  return emptyobject(value)
}
const emptystring = value => {
  return not(value) || !string(value) || !length(value)
}
const emptyarray = value => not(value) || !array(value) || !length(value)

const emptyobject = value => {
  return not(value) || !object(value) || !length(Object.keys(value))
}
const nonobject = value => value.constructor.name !== "Object"

const instanceOf = (value, klass) => Is.object(value) && value instanceof klass
const defined = value => !Is.undefined(value)

const objectStrict = value => object(value) && !(not(value) || array(value))

const float = value => number(value) && !integer(value)
const nan = value => number(value) && isNaN(value)

const positive = value => integer(value) && value >= 0

const Is = {
  nonobject,
  empty,
  emptyarray,
  emptyobject,
  emptystring,
  float,
  object, 
  undefined,
  boolean,
  number,
  integer,
  string,
  array,
  instanceOf,
  defined,
  method,
  nan,
  nil,
  not, 
  objectStrict,
  positive,
}

export { Is }