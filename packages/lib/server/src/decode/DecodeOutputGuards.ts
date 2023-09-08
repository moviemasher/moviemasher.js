import type { DecodeOutput } from './DecodeTypes.js'

import { isOutput } from '@moviemasher/lib-shared'
import { errorThrow } from '@moviemasher/runtime-shared'
import { isDecodingType } from './DecodingFunctions.js'

export const isDecodeOutput = (value: any): value is DecodeOutput => {
  return isOutput(value) && 'type' in value && isDecodingType(value.type)
}

export function assertDecodeOutput(value: any): asserts value is DecodeOutput {
  if (!isDecodeOutput(value)) errorThrow(value, 'DecodeOutput')
}


