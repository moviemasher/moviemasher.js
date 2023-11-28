import type { ValueRecord } from './Core.js'
import type { ErrorObject, DefiniteError } from './Error.js'

import { ERROR_NAMES, ERROR } from './ErrorName.js'
import { jsonStringify } from './JsonFunctions.js'
import { isObject, isPopulatedString, isString } from './TypeofGuards.js'

export type ErrorNameType = typeof ERROR[keyof typeof ERROR] | string

export type ErrorContext = ValueRecord | string | undefined

export const isErrorName = (value: any): value is ErrorNameType => (
  (isString(value)) && ERROR_NAMES.includes(value)
)

export const errorMessage = (name: ErrorNameType, context?: ErrorContext): string => (
  isString(context) ? context : name
)

export const errorMessageObject = (message: string, name: string = ERROR.Internal, cause?: unknown): ErrorObject => {
  const error = new Error(message)
  Object.assign(error, { name, cause })
  return error
}

export const errorObjectCaught = (error: any): ErrorObject => {
  if (isErrorName(error)) return errorName(error) 
  if (isString(error)) return errorMessageObject(error)
  
  const { message: errorMessage = '', name = ERROR.Internal } = error
  const message = errorMessage || String(name)
  return errorMessageObject(message, name, error)
}

export const errorName = (name: ErrorNameType, context?: ErrorContext): ErrorObject => {
  // console.log('errorName', name, context)
  return { name, message: errorMessage(name, context), cause: context }
}

export const errorCaught = (error: any): DefiniteError => {
  // console.error('errorCaught', error)
  return { error: errorObjectCaught(error) }
}

export const errorPromise = (name: ErrorNameType, context?: ErrorContext): Promise<DefiniteError & any> => (
  Promise.resolve(namedError(name, context))
)

const errorExpected = (value: any, expected: string, prop?: string): ErrorObject => {
  const type = typeof value
  const isDefined = type !== 'undefined'
  const isObject = type === 'object'
  const name = prop || (isDefined ? type : 'value')
  const words = [name, 'is']
  words.push(isObject ? value.constructor.name : type)
  if (isDefined) words.push(isObject ? jsonStringify(value) : `'${value}'`)
  if (isPopulatedString(expected)) words.push('instead of', expected)
  return errorMessageObject(words.join(' '), ERROR.Type)
}

export const errorThrow = (value: any, type?: ErrorContext, property?: string): never => {
  const typeIsString = isPopulatedString(type)
  const object = typeIsString ? errorExpected(value, type, property) : errorObjectCaught(value)

  const { message, name, cause } = object
  const errorCause = typeIsString ? cause : type
  const throwObject = errorMessageObject(message, name, errorCause)
  // console.trace(throwObject.toString())
  throw throwObject
}

export const namedError = (code: ErrorNameType, context?: ErrorContext): DefiniteError => (
  { error: errorName(code, context)}
)

export const isDefiniteError = (value: any): value is DefiniteError => {
  return isObject(value) && 'error' in value // && isObject(value.error)
}
