import type { Transcoding, TranscodingType, TranscodingTypes } from '@moviemasher/runtime-shared'

import { FONT, SEQUENCE, WAVEFORM, ASSET_TYPES, errorThrow } from '@moviemasher/runtime-shared'
import { isRequestable } from '../Base/Requestable/RequestableFunctions.js'

export const TypesTranscoding: TranscodingTypes = [...ASSET_TYPES, FONT, SEQUENCE, WAVEFORM]

export const isTranscodingType = (type?: any): type is TranscodingType => {
  return TypesTranscoding.includes(type)
}

export function assertTranscodingType(type: any, name?: string): asserts type is TranscodingType {
  if (!isTranscodingType(type))
    errorThrow(type, 'TranscodingType', name)
}

export const isTranscoding = (value: any): value is Transcoding => {
  return isRequestable(value) && isTranscodingType(value.type)
}
