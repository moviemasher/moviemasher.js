import { Encoding, EncodingObject } from "./Encoding"
import { EncodingClass } from "./EncodingClass"

export const encodingInstance = (object: EncodingObject): Encoding => {
  return new EncodingClass(object)
}