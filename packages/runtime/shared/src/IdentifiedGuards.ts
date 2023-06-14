import type { Identified } from './Identified.js'

import { errorThrow } from './ErrorFunctions.js'
import { isObject, isPopulatedString } from './TypeofGuards.js'

export const isIdentified = (value: any): value is Identified => {
  return isObject(value) && 'id' in value && isPopulatedString(value.id)
}
export function assertIdentified(value: any, name?: string): asserts value is Identified {
  if (!isIdentified(value))
    errorThrow(value, 'Identified', name)
}
