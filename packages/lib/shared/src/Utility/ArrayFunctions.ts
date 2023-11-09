import type { Strings, Numbers } from '@moviemasher/runtime-shared'
import { isArray, isString } from '@moviemasher/runtime-shared'
import { COMMA } from '../Setup/Constants.js'


export const arrayLast = <T=unknown>(array: T[]): T => array[array.length - 1]

export const arraySet = <T=unknown>(array: T[], items: T[]): T[] => {
  array.splice(0, array.length, ...items)
  return array
}

export const arrayReversed = <T=unknown>(array: T[]): T[] => {
  return [...array].reverse()
}

export const arrayUnique = <T=unknown>(array: T[]): T[] => {
  return [...new Set(array)]
}

export const arrayOfNumbers = (count = 0, start = 0): Numbers => (
  [...Array(count)].map((_, index) => start + index)
)

export const arraysEqual = <T=unknown>(a: T[], b: T[]): a is T[] => (
  a.length === b.length && a.every((value, index) => value === b[index])
)

export function arrayFromOneOrMore<T>(value?: T | T[]): T[] {
  if (typeof value === 'undefined') return []

  if (isArray<T>(value)) return value

  if (isString(value)) {
    const strings: Strings = value ? value.split(COMMA) : []
    if (isArray<T>(strings)) return strings 
  }
  return [value]
}
