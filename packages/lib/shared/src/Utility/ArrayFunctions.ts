import type { Numbers, Unknowns } from '@moviemasher/runtime-shared'


export const arrayLast = (array: Unknowns): any => array[array.length - 1 ]

export const arraySet = (array: Unknowns, items: Unknowns) => {
  array.splice(0, array.length, ...items)
  return array
}

export const arrayReversed = (array: Unknowns) => {
  return [...array].reverse()
}

export const arrayUnique = (array: Unknowns) => {
  return [...new Set(array)]
}

export const arrayOfNumbers = (count = 0, start = 0): Numbers => (
  [...Array(count)].map((_, index) => start + index)
)

