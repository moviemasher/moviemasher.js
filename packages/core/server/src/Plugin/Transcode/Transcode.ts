import { 
  MediaType, TranscodeOutput, DefiniteError, 
  Identified 
} from "@moviemasher/moviemasher.js"
import { Input } from "../../Types/Core"
import { MediaRequest } from "../../Media/Media"

export interface TranscodeInput extends Required<Input> {
  type: MediaType
}


export interface TranscodeRequest extends MediaRequest {
  input: TranscodeInput
  output: TranscodeOutput
}

export type TranscodeResponse = DefiniteError | Identified
