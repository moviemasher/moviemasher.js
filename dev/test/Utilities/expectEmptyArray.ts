import { expectArray } from "./expectArray"

export const expectEmptyArray = (value : any) : any[] => {
  const array = expectArray(value)

  if (array.length > 0) {
    console.error("expectEmptyArray with length", array.length, "first element", array[0])
  }
  expect(array.length).toBe(0)

  return array
}
