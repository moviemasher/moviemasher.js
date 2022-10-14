import { AnyArray } from "../declarations"

export const arrayLast = (array: AnyArray): any => array[array.length - 1 ]

export const arraySet = (array: AnyArray, items: AnyArray) => {
  array.splice(0, array.length, ...items)
  return array
}

export const arrayReversed = (array: AnyArray) => {
  return [...array].reverse()
}

export const arrayUnique = (array: AnyArray) => {
  return [...new Set(array)]
}