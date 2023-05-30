import type {
  DecodeOutput, EncodingType
} from "@moviemasher/lib-core"

import type { Input } from "../../Types/Core.js"
import type { MediaRequest } from "../../Media/Media.js"

export interface DecodeRequest extends MediaRequest {
  input: DecodeInput
  output: DecodeOutput
}

export interface DecodeInput extends Required<Input> {
  type: EncodingType
}



