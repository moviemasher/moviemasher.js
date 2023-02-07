import { 
  assertMethod, errorsThrow, DefinitionType, DecodeOutput 
} from "@moviemasher/moviemasher.js"
import { Input } from "../declarations"
import { isMediaRequest, MediaRequest, MediaResponse } from "../Media/Media"
import { Decoders } from './Decoders/Decoders'

export type Decoder = (localPath: string, options?: unknown) => Promise<DecodeResponse>


export interface DecodeRequest extends MediaRequest {
  input: DecodeInput
  output: DecodeOutput
}
export const isDecodeRequest = (value: any): value is DecodeRequest => {
  return isMediaRequest(value) 
} 
export function assertDecodeRequest(value: any): asserts value is DecodeRequest {
  if (!isDecodeRequest(value)) errorsThrow(value, 'DecodeRequest')
}

export interface DecodeResponse extends MediaResponse {
  info?: any
  width?: number
  height?: number
  duration?: number
  alpha?: boolean
  audio?: boolean
}

export interface DecodeInput extends Required<Input> {
  type: DefinitionType
}

export const decode = (localPath: string, output: DecodeOutput): Promise<DecodeResponse> => {
  const { type } = output
  const decoder = Decoders[type]
  assertMethod(decoder)
  return decoder(localPath, output.options)
}

