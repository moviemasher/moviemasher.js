import {Decoding, DecodingObject} from '@moviemasher/runtime-shared'
import {DecodingClass} from './DecodingClass.js'

export const decodingInstance = (object: DecodingObject): Decoding => {
  return new DecodingClass(object)
}