import type { Requestable, RequestableObject } from './Requestable.js'

import { isObject } from '../../Utility/Is.js'
import { isIdentified } from '../IdentifiedFunctions.js'

export const isRequestableObject = (value: any): value is RequestableObject => {
  return isIdentified(value)
}

export const isRequestable = (value: any): value is Requestable => {
  return isObject(value) && 'request' in value 
}

