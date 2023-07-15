import type { Numbers } from '@moviemasher/runtime-shared'


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

