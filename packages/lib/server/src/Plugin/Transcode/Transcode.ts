import { 
  MediaType, TranscodeOutput, 
} from "@moviemasher/lib-shared"
import { Input } from "../../Types/Core.js"
import { MediaRequest } from "../../Media/Media.js"
import { DefiniteError, Identified } from "@moviemasher/runtime-shared"

export interface TranscodeInput extends Required<Input> {
  type: MediaType
}


export interface TranscodeRequest extends MediaRequest {
  input: TranscodeInput
  output: TranscodeOutput
}

export type TranscodeResponse = DefiniteError | Identified

export interface Transcoder {}