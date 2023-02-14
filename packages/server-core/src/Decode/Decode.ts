import { 
  assertMethod, errorThrow, RawType, DecodeOutput, Plugins, DecodeResponse 
} from "@moviemasher/moviemasher.js"
import { Input } from "../declarations"
import { isMediaRequest, MediaRequest } from "../Media/Media"


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

export const decode = (localPath: string, output: DecodeOutput): Promise<DecodeResponse> => {
  const { type } = output
  const { decode } = Plugins.decoders[type]
  assertMethod(decode)
  return decode(localPath, output.options)
}

