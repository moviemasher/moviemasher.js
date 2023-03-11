import {
  DecodeOutput, DecodePlugin, EncodingType, isDefiniteError, pluginDataOrErrorPromise
} from "@moviemasher/moviemasher.js"
import { 
  DecodeType, errorThrow, 
} from "@moviemasher/moviemasher.js"

import { Input } from "../../Types/Core"
import { isMediaRequest, MediaRequest } from "../../Media/Media"

export interface DecodeRequest extends MediaRequest {
  input: DecodeInput
  output: DecodeOutput
}
export const isDecodeRequest = (value: any): value is DecodeRequest => {
  return isMediaRequest(value) 
} 
export function assertDecodeRequest(value: any): asserts value is DecodeRequest {
  if (!isDecodeRequest(value)) errorThrow(value, 'DecodeRequest')
}

export interface DecodeInput extends Required<Input> {
  type: EncodingType
}

export const decode = (localPath: string, output: DecodeOutput) => {
  const { type } = output
  return pluginDataOrErrorPromise(type, DecodeType).then(orError => {
    if (isDefiniteError(orError)) return orError
    const { data: plugin } = orError
    const { decode } = plugin as DecodePlugin
    return decode(localPath, output.options)
  })
}

