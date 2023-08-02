import type { Decoding, DecodingType } from '@moviemasher/runtime-shared'
import { isObject, TypesDecoding, errorThrow} from '@moviemasher/runtime-shared'

export const isDecodingType = (value: any): value is DecodingType => TypesDecoding.includes(value)

export const isDecoding = (value: any): value is Decoding => (
  isObject(value) && 'type' in value && isDecodingType(value.type)
)
export function assertDecoding(value: any): asserts value is Decoding {
  if (!isDecoding(value)) errorThrow(value, 'Decoding') 
}

