import assert from 'assert'

import { isPositive, isArray, isDefined } from "@moviemasher/lib-core"

export const expectArrayLength = (value, length = -1, constructor) => {
  const array = expectArray(value, constructor)
  const { length: arrayLength } = array
  if (isPositive(length)) {
    if (arrayLength !== length) {
      console.error("expectArrayLength", arrayLength, '!==', length, array)
      assert.equal(array.length).toEqual(length)
    }
  } else if (!arrayLength) {
    console.error("expectArrayLength", arrayLength, '< 1', array)
    assert.toBeGreaterThan(array.length, 0)
  }
  return array
}

export const expectArray = (value, constructor)  => {
  if (isArray(value)) {
    if (!(value.length && constructor)) return value

    const [element] = value
    if (isDefined(element)) {
      if (element instanceof constructor) return value


      console.error('expectArray', element.constructor.name, "!==", element.constructor)
      assert.toBeInstanceOf(element, constructor)
    }
    console.error('expectArray first element undefined')
    assert.toBeDefined(element)
  }
  console.error('expectArray', typeof value, value?.constructor.name)
  assert.toBeInstanceOf(value, Array)
  throw 
}

export const expectEmptyArray = (value) => {
  const array = expectArray(value)

  if (array.length > 0) {
    console.error("expectEmptyArray with length", array.length, "first element", array[0])
  }
  assert.equal(array.length, 0)

  return array
}

