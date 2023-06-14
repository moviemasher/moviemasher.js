import { errorThrow } from './ErrorFunctions.js'
import { Typed } from './Typed.js'
import { isObject, isPopulatedString } from './TypeofGuards.js'

export const isTyped = (value: any): value is Typed => {
  return isObject(value) &&
    'type' in value &&
    isPopulatedString(value.type)
}
export function assertTyped(value: any, name?: string): asserts value is Typed {
  if (!isTyped(value))
    errorThrow(value, 'Typed', name)
}
