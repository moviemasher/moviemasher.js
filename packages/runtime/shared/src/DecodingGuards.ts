import type { Decoding } from './CodeTypes.js'

import { errorThrow } from './ErrorFunctions.js'
import { isTyped } from './TypedGuards.js'
import { isPopulatedString } from './TypeofGuards.js'

export const isDecodingType = isPopulatedString

export const isDecoding = (value: any): value is Decoding => (
  isTyped(value) && isDecodingType(value.type)
)
export function assertDecoding(value: any): asserts value is Decoding {
  if (!isDecoding(value)) errorThrow(value, 'Decoding') 
}
