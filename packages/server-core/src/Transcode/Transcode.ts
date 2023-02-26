import { 
  MediaType, errorThrow, isTranscodeOutput, TranscodeOutput, DefiniteError, 
  Identified 
} from "@moviemasher/moviemasher.js"
import { Input } from "../declarations"
import { isMediaRequest, MediaRequest } from "../Media/Media"

export interface TranscodeInput extends Required<Input> {
  type: MediaType
}


export interface TranscodeRequest extends MediaRequest {
  input: TranscodeInput
  output: TranscodeOutput
}
export const isTranscodeRequest = (value: any): value is TranscodeRequest => {
  return isMediaRequest(value) && "output" in value && isTranscodeOutput(value.output)
}

export function assertTranscodeRequest(value: any): asserts value is TranscodeRequest {
  if (!isTranscodeRequest(value)) errorThrow(value, 'TranscodeRequest')
}

export type TranscodeResponse = DefiniteError | Identified
