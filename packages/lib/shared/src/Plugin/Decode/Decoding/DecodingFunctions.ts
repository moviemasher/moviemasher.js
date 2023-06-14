import {errorThrow} from '@moviemasher/runtime-shared'
import { isObject } from "@moviemasher/runtime-shared"
import {Decoding, isDecodingType} from '@moviemasher/runtime-shared'

export const isDecoding = (value: any): value is Decoding => (
  isObject(value) && 'type' in value && isDecodingType(value.type)
)
export function assertDecoding(value: any): asserts value is Decoding {
  if (!isDecoding(value)) errorThrow(value, 'Decoding') 
}

