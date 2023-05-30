import { 
  MediaType, TranscodeOutput, DefiniteError, 
  Identified 
} from "@moviemasher/lib-core"
import { Input } from "../../Types/Core.js"
import { MediaRequest } from "../../Media/Media.js"

export interface TranscodeInput extends Required<Input> {
  type: MediaType
}


export interface TranscodeRequest extends MediaRequest {
  input: TranscodeInput
  output: TranscodeOutput
}

export type TranscodeResponse = DefiniteError | Identified

export interface Transcoder {}