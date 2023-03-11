
import assert from 'assert'
export const isString = (value) => typeof value === 'string' && value


export const assertString = (value, name = 'value') => {
  assert(isString(value), `${name} is ${value?.constructor.name} instead of populated string`)
}

export const isPath = (value) => isString(value) && (value.startsWith('/') || value.startsWith('.'))

export const assertPath = (value, name = 'value') => {
  assert(isPath(value), `${name} is ${value?.constructor.name} instead of absolute path`)
}

export const isJsonPath = (value) => isPath(value) && value.endsWith('.json')
export const assertJsonPath = (value, name = 'value') => {
  assert(isJsonPath(value), `${name} is ${value?.constructor.name} instead of absolute path to json file`)
}

export const isObject = (value) => typeof value === 'object' 
export const assertObject = (value, name = 'value') => {
  assert(isObject(value), `${name} is ${value?.constructor.name} instead of object ${value}`)
}

export const isArray = (value) => Array.isArray(value)
export const assertArray = (value, name = 'value') => {
  assert(isArray(value), `${name} is array`)
}

export const isJsonString = (value) => {
  try {
    JSON.parse(value)
    return true
  } catch (error) {
    return false
  }
}