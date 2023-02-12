import { MediaType, errorThrow, isTranscodeOutput, PathOrError, TranscodeOutput } from "@moviemasher/moviemasher.js"
import { Input } from "../declarations"
import { isMediaRequest, MediaRequest, MediaResponse } from "../Media/Media"

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

export interface TranscodeResponse extends MediaResponse, PathOrError {}

