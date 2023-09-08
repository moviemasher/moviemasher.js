import type { AssetType } from '@moviemasher/runtime-shared'
import type { IdentifiedRequest } from '../Media/Media.js'
import type { Input } from '../Types/Input.js'
import type { DecodeOutput } from './DecodeTypes.js'

export interface DecodeRequest extends IdentifiedRequest {
  input: DecodeInput
  output: DecodeOutput
}

export interface DecodeInput extends Required<Input> {
  type: AssetType
}
