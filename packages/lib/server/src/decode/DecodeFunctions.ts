
import type { DecodeOutput } from './DecodeTypes.js'
import type { DecodeRequest } from './Decode.js'

import { ERROR, errorPromise, errorThrow } from '@moviemasher/runtime-shared'
import { isIdentifiedRequest } from '../Media/MediaFunctions.js'
import { EventServerDecode } from '@moviemasher/runtime-server'

export const isDecodeRequest = (value: any): value is DecodeRequest => {
  return isIdentifiedRequest(value)
}
export function assertDecodeRequest(value: any): asserts value is DecodeRequest {
  if (!isDecodeRequest(value)) errorThrow(value, 'DecodeRequest')
}

export const decode = (localPath: string, output: DecodeOutput) => {
  const { type, options } = output

  return errorPromise(ERROR.Unimplemented, EventServerDecode.Type)
}
