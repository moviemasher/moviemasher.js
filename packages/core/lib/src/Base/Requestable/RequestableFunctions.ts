import type { Requestable, RequestableObject } from './Requestable.js'

import { isObject } from '../../Shared/SharedGuards.js'

export const isRequestable = (value: any): value is Requestable => {
  return isObject(value) && 'request' in value 
}

