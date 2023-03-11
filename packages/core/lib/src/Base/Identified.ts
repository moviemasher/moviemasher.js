import { isObject, isPopulatedString } from "../Utility/Is"
import { errorThrow } from "../Helpers/Error/ErrorFunctions"

export interface Identified {
  id: string
}
export const isIdentified = (value: any): value is Identified => {
  return isObject(value) && "id" in value && isPopulatedString(value.id)
}
export function assertIdentified(value: any, name?: string): asserts value is Identified {
  if (!isIdentified(value)) errorThrow(value, 'Identified', name)
}