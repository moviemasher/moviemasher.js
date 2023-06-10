import { Encoding, EncodingObject } from './Encoding.js'
import { EncodingClass } from './EncodingClass.js'

export const encodingInstance = (object: EncodingObject): Encoding => {
  return new EncodingClass(object)
}