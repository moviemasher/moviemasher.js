import type {
  DecodeOutput
} from "@moviemasher/lib-shared"

import type { Input } from "../../Types/Core.js"
import type { MediaRequest } from "../../Media/Media.js"
import { AssetType } from "@moviemasher/runtime-shared"

export interface DecodeRequest extends MediaRequest {
  input: DecodeInput
  output: DecodeOutput
}

export interface DecodeInput extends Required<Input> {
  type: AssetType
}



