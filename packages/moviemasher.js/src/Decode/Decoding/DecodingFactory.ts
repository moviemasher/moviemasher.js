import { Decoding, DecodingObject } from "./Decoding"
import { DecodingClass } from "./DecodingClass"

export const decodingInstance = (object: DecodingObject): Decoding => {
  return new DecodingClass(object)
}