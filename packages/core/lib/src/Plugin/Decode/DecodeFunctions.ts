import {DecodeOutput} from './Decode.js'

import {isOutput} from '../../Base/Code.js'
import {errorThrow} from '../../Helpers/Error/ErrorFunctions.js'
import {isDecodingType} from './Decoding/Decoding.js'


export const isDecodeOutput = (value: any): value is DecodeOutput => {
  return isOutput(value) && 'type' in value && isDecodingType(value.type)
}

export function assertDecodeOutput(value: any): asserts value is DecodeOutput {
  if (!isDecodeOutput(value)) errorThrow(value, 'DecodeOutput')
}


