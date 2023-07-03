import { isArray, isObject } from './TypeofGuards.js'

export function arrayFromOneOrMore<T>(value?: T | T[]): T[] {
  if (!isObject(value)) return []

  return isArray<T>(value) ? value : [value]
}
