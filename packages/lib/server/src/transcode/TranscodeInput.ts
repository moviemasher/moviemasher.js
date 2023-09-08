import type { DefiniteError, Identified, ImportType } from '@moviemasher/runtime-shared'
import type { IdentifiedRequest } from '../Media/Media.js'
import type { Input } from '../Types/Input.js'
import type { TranscodeOutput } from './TranscodeTypes.js'

export interface TranscodeInput extends Required<Input> {
  type: ImportType
}


export interface TranscodeRequest extends IdentifiedRequest {
  input: TranscodeInput
  output: TranscodeOutput
}

export type TranscodeResponse = DefiniteError | Identified
