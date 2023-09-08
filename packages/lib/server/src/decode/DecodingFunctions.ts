import type { Decoding } from '@moviemasher/runtime-shared'

import { errorThrow, isObject, isPopulatedString } from '@moviemasher/runtime-shared'

export const isDecodingType = isPopulatedString

export const isDecoding = (value: any): value is Decoding => (
  isObject(value) && 'type' in value && isDecodingType(value.type)
)
export function assertDecoding(value: any): asserts value is Decoding {
  if (!isDecoding(value)) errorThrow(value, 'Decoding') 
}
