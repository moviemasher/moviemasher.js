import { isObject, isString } from "../../../Utility/Is"
import { Decoding } from "./Decoding"


export const isDecoding = (value: any): value is Decoding => (
  isObject(value) && "type" in value && isString(value.type)
)
export function assertDecoding(value: any): asserts value is Decoding {
  if (!isDecoding(value)) throw new Error('expected Decoding')
}

