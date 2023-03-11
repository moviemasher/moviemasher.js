import { errorThrow } from "../../../Helpers/Error/ErrorFunctions"
import { isObject } from "../../../Utility/Is"
import { Decoding, isDecodingType } from "./Decoding"

export const isDecoding = (value: any): value is Decoding => (
  isObject(value) && "type" in value && isDecodingType(value.type)
)
export function assertDecoding(value: any): asserts value is Decoding {
  if (!isDecoding(value)) errorThrow(value, 'Decoding') 
}

