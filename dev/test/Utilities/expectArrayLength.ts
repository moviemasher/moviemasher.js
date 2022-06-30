import { isPositive } from "../../../packages/moviemasher.js/src/Utility/Is"
import { Constructor } from "../src/declarations"
import { expectArray } from "./expectArray"

export const expectArrayLength = (value: any, length = -1, constructor?: Constructor): any[] => {
  const array = expectArray(value, constructor)
  const { length: arrayLength } = array
  if (isPositive(length)) {
    if (arrayLength !== length) {
      console.error("expectArrayLength", arrayLength, '!==', length, array)
      expect(array.length).toEqual(length)
    }
  } else if (!arrayLength) {
    console.error("expectArrayLength", arrayLength, '< 1', array)
    expect(array.length).toBeGreaterThan(0)
  }
  return array
}
