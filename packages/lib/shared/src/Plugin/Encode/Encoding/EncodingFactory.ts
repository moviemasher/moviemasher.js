import { Encoding, EncodingObject } from '@moviemasher/runtime-client'
import { EncodingClass } from './EncodingClass.js'

export const encodingInstance = (object: EncodingObject): Encoding => {
  return new EncodingClass(object)
}