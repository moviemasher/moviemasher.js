import type { Decoding } from './Decoding.js'

import { errorThrow } from './ErrorFunctions.js'
import { isObject, isPopulatedString } from './TypeofGuards.js'

export const isDecodingType = isPopulatedString

export const isDecoding = (value: any): value is Decoding => (
  isObject(value) && 'type' in value && isDecodingType(value.type)
)
export function assertDecoding(value: any): asserts value is Decoding {
  if (!isDecoding(value)) errorThrow(value, 'Decoding') 
}
