import {DecodeOutput} from './Decode.js'

import { isOutput } from "../../Base/Output.js"
import {errorThrow} from '@moviemasher/runtime-shared'
import {isDecodingType} from '@moviemasher/runtime-shared'


export const isDecodeOutput = (value: any): value is DecodeOutput => {
  return isOutput(value) && 'type' in value && isDecodingType(value.type)
}

export function assertDecodeOutput(value: any): asserts value is DecodeOutput {
  if (!isDecodeOutput(value)) errorThrow(value, 'DecodeOutput')
}


