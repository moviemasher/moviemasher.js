import { isOutput } from "../../Base/Code";
import { errorThrow } from "../../Helpers/Error/ErrorFunctions";
import { DecodeOutput, isDecodingType } from "./Decoder";


export const isDecodeOutput = (value: any): value is DecodeOutput => {
  return isOutput(value) && "type" in value && isDecodingType(value.type)
}

export function assertDecodeOutput(value: any): asserts value is DecodeOutput {
  if (!isDecodeOutput(value)) errorThrow(value, 'DecodeOutput')
}


