import { 
  assertMethod, errorThrow, RawType, DecodeOutput, Plugins, DecodeDataOrError, DecodeMethod, DecodeType, DecodePlugin 
} from "@moviemasher/moviemasher.js"
import { Input } from "../../declarations"
import { isMediaRequest, MediaRequest } from "../../Media/Media"


export interface DecodeRequest extends MediaRequest {
  input: DecodeInput
  output: DecodeOutput
}
export const isDecodeRequest = (value: any): value is DecodeRequest => {
  return isMediaRequest(value) 
} 
export function assertDecodeRequest(value: any): asserts value is DecodeRequest {
  if (!isDecodeRequest(value)) errorThrow(value, 'DecodeRequest')
}

export interface DecodeInput extends Required<Input> {
  type: RawType
}

export const decode = (localPath: string, output: DecodeOutput) => {
  const { type } = output
  const { decode } = Plugins[DecodeType][type] as DecodePlugin

  return decode(localPath, output.options)
}

