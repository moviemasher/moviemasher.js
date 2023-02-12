import { errorThrow } from "../Helpers/Error/ErrorFunctions"
import { isObject, isPopulatedString } from "../Utility/Is"

export interface Typed {
  type: string
}
export const isTyped = (value: any): value is Typed => {
  return isObject(value) && isPopulatedString(value.id)
}
export function assertTyped(value: any, name?: string): asserts value is Typed {
  if (!isTyped(value)) errorThrow(value, 'Typed', name)
}