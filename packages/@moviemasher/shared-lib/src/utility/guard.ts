import type { ClientAudio, ClientFont, ClientImage, ClientVideo, Integer, Not, Numeric, OkNumber, PopulatedArray, PopulatedString, StringTuple, Value } from '../types.js'

const isNan = (value: any): boolean => { return Number.isNaN(value) }

const isNull = (value: any): boolean => { return value === null }

const numberInvalid = (value: any): boolean => {
  return isNan(value) || value === Infinity || value === -Infinity
}

const typeofNumber = (value: any): value is number => {
  return typeof value === 'number'
}

const typeofUndefined = (value: any): boolean => {
  return typeof value === 'undefined'
}

export const isAboveZero = (value: any): value is number => {
  return isNumber(value) && value > 0
}

export const isArray = <T = unknown>(value: any): value is Array<T> => {
  return Boolean(Array.isArray(value))
}

export const isBelowOne = (value: any): value is number => {
  return isNumber(value) && value < 1
}

export const isDate = (value: any): value is Date => {
  return value instanceof Date
}

export const isDefined = <T = any>(value: any): value is T => {
  return !isUndefined(value)
}

export const isFunction = (value: any): value is Function => {
  return typeof value === 'function'
}

export const isNumber = (value: any): value is OkNumber => {
  return typeofNumber(value) && !numberInvalid(value)
}

export const isNumeric = (value: any): value is Numeric => {
  return isNumber(value) || (isPopulatedString(value) && !isNan(Number(value)))
}

export const isPopulatedString = (value: any): value is PopulatedString => {
  return (
    isString(value) && Boolean(value.length)
  )
}

export const isPopulatedArray = <T = unknown>(value: any): value is PopulatedArray<T> => {
  return (
    isArray<T>(value) && Boolean(value.length)
  )
}

export const isString = (value: any): value is string => {
  return typeof value === 'string'
}

export const isUndefined = (value: any): value is Not => {
  return typeofUndefined(value) || isNull(value) 
}

export const isInteger = (value: any): value is Integer => {
  return Number.isInteger(value)
}

export const isPositive = (value: any): value is number => {
  return isNumber(value) && value >= 0
}

export const isValue = (value: any): value is Value => {
  return isNumber(value) || isString(value) 
}

export const isObject = (value: any): value is object => {
  return typeof value === 'object'
}

export const isClientAudio = (value: any): value is ClientAudio => {
  return isObject(value) && value instanceof AudioBuffer
}

export const isClientVideo = (value: any): value is ClientVideo => {
  return isObject(value) && value instanceof HTMLVideoElement
}
export const isClientImage = (value: any): value is ClientImage => {
  return isObject(value) && value instanceof HTMLImageElement
}

export const isClientFont = (value: any): value is ClientFont => {
  return isObject(value) && value instanceof FontFace
}
export const isStringTuple = (value: any): value is StringTuple => {
  return isArray(value) && value.length === 2 && value.every(isPopulatedString)
}
