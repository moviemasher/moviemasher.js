import { Unknowns } from "../declarations"

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