import { isPositive, isArray, isDefined } from "../../../packages/moviemasher.js/src/Utility/Is"
import { Errors } from "../../../packages//moviemasher.js/src/Setup/Errors"
import { Constructor } from "../src/declarations"

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

export const expectArray = (value: any, constructor?: Constructor) : Array<any> => {
  if (isArray(value)) {
    if (!(value.length && constructor)) return value

    const [element] = value
    if (isDefined(element)) {
      if (element instanceof constructor) return value


      console.error('expectArray', element.constructor.name, "!==", element.constructor)
      expect(element).toBeInstanceOf(constructor)
    }
    console.error('expectArray first element undefined')
    expect(element).toBeDefined()
  }
  console.error('expectArray', typeof value, value?.constructor.name)
  expect(value).toBeInstanceOf(Array)
  throw Errors.internal
}

export const expectEmptyArray = (value : any) : any[] => {
  const array = expectArray(value)

  if (array.length > 0) {
    console.error("expectEmptyArray with length", array.length, "first element", array[0])
  }
  expect(array.length).toBe(0)

  return array
}

