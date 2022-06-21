import { Errors } from "../../../packages//moviemasher.js/src"
import { isArray, isDefined } from "../../../packages/moviemasher.js/src/Utility/Is"
import { Constructor } from "../src/declarations"

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
