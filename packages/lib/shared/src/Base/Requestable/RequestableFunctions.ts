import type { Requestable } from '@moviemasher/runtime-client'

import { isObject } from '@moviemasher/runtime-shared'

export const isRequestable = (value: any): value is Requestable => {
  return isObject(value) && 'request' in value 
}
