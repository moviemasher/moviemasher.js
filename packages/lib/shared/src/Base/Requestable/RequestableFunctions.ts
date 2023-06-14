import type { Requestable, RequestableObject } from '@moviemasher/runtime-shared'

import { isObject } from "@moviemasher/runtime-shared"

export const isRequestable = (value: any): value is Requestable => {
  return isObject(value) && 'request' in value 
}

