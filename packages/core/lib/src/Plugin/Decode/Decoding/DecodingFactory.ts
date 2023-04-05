import {Decoding, DecodingObject} from './Decoding.js'
import {DecodingClass} from './DecodingClass.js'

export const decodingInstance = (object: DecodingObject): Decoding => {
  return new DecodingClass(object)
}