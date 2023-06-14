import type { 
  DecodeOutput, 
} from '@moviemasher/lib-shared'

import { 
  isDefiniteError, pluginDataOrErrorPromise,  TypeDecode, 
} from '@moviemasher/lib-shared'
import { isMediaRequest } from "../../Media/MediaFunctions.js"
import { DecodeRequest } from './Decode.js'
import { errorThrow } from '@moviemasher/runtime-shared'

export const isDecodeRequest = (value: any): value is DecodeRequest => {
  return isMediaRequest(value)
}
export function assertDecodeRequest(value: any): asserts value is DecodeRequest {
  if (!isDecodeRequest(value)) errorThrow(value, 'DecodeRequest')
}

export const decode = (localPath: string, output: DecodeOutput) => {
  const { type, options } = output
  return pluginDataOrErrorPromise(type, TypeDecode).then(orError => {
    if (isDefiniteError(orError)) return orError

    const { data: plugin } = orError
    const { decode } = plugin //as DecodePlugin
    return decode(localPath, options)
  })
}
