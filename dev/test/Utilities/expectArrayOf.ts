import { Any, Constructor } from "../../../packages/moviemasher.js/src/declarations"
import { expectArray } from "./expectArray"

const expectArrayOf = (value : Any, klass : Constructor, length? : number) : Any[] => {
  const array = expectArray(value)
  if (array.length === 0) {
    console.error("expectArrayOf with zero length", array)
  }
  if (length) expect(array.length).toEqual(length)
  else expect(array.length).toBeGreaterThan(0)
  const element = array[0]
  if (!element) throw 'expectArrayOf'

  const is = element instanceof klass
  if (!is) console.error('expectArrayOf', typeof element, element.constructor.name)
  expect(element).toBeInstanceOf(klass)

  return array
}

export { expectArrayOf }