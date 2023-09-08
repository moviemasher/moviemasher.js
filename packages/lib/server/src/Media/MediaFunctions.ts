import type { IdentifiedRequest } from './Media.js'

import { errorThrow, isIdentified, isObject } from '@moviemasher/runtime-shared'

export const isIdentifiedRequest = (value: any): value is IdentifiedRequest => {
  return isIdentified(value) && 'input' in value && isObject(value.input)
}

export function assertIdentifiedRequest(value: any): asserts value is IdentifiedRequest {
  if (!isIdentifiedRequest(value)) errorThrow(value, 'IdentifiedRequest')
}
