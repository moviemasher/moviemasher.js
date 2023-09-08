import type { Output } from '@moviemasher/lib-shared'
import type { Data, Decoding, DecodingType, DefiniteError } from '@moviemasher/runtime-shared'

export type DecodeData = Data<Decoding>
export type DecodeDataOrError = DefiniteError | DecodeData

export interface DecodeOutput extends Output {
  type: DecodingType
  options?: unknown
}
