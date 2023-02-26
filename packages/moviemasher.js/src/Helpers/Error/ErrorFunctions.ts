import { ValueRecord } from "../../declarations"
import { ErrorName, ErrorNames } from "./ErrorName"
import { DefiniteError, ErrorObject } from "./Error"

export type ErrorContext = ValueRecord | string | undefined


export const isErrorName = (value: any): value is ErrorName => (
  (typeof value === 'string') && ErrorNames.includes(value as ErrorName)
)

export const errorMessage = (name: ErrorName, context?: ErrorContext): string => {
  if (typeof context === 'string') return context


  return name
}

export const errorObject = (message: string, name: string = ErrorName.Internal, cause?: unknown): ErrorObject => {
  const error = new Error(message)
  Object.assign(error, { name, cause })
  return error
}

export const errorObjectCaught = (error: any): ErrorObject => {
  if (isErrorName(error)) return errorName(error) 
  if (typeof error === 'string') return errorObject(error)
  
  const { message: errorMessage = '', name = ErrorName.Internal } = error
  const message = errorMessage || String(name)
  return errorObject(message, name, error)
}

export const errorName = (name: ErrorName, context?: ErrorContext): ErrorObject => (
  { name, message: errorMessage(name, context) }
)

export const error = (code: ErrorName, context?: ErrorContext): DefiniteError => (
  { error: errorName(code, context)}
)

export const errorCaught = (error: any): DefiniteError => (
  { error: errorObjectCaught(error) }
)


export const errorPromise = (name: ErrorName, context?: ErrorContext): Promise<DefiniteError & any> => (
  Promise.resolve(error(name, context))
)

const errorExpected = (value: any, expected: string, prop?: string): ErrorObject => {
  const type = typeof value
  const isDefined = type !== 'undefined'
  const isObject = type === 'object'
  const name = prop || (isDefined ? type : 'value')
  const words = [name, 'is']
  words.push(isObject ? value.constructor.name : type)
  if (isDefined) words.push(isObject ? JSON.stringify(value) : `'${value}'`)
  words.push('instead of', expected)
  return errorObject(words.join(' '), ErrorName.Type)
}

export const errorThrow = (value: any, type?: string, property?: string): never => {
  const object = type ? errorExpected(value, type, property) : errorObjectCaught(value)
  const { message, name, cause } = object

  const error = errorObject(message, name, cause)
  console.trace(error.toString())
  throw error
}