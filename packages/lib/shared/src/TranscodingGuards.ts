import type { TranscodingType, TranscodingTypes } from '@moviemasher/runtime-shared'

import { FONT, SEQUENCE, WAVEFORM, ASSET_TYPES, errorThrow } from '@moviemasher/runtime-shared'

export const TypesTranscoding: TranscodingTypes = [...ASSET_TYPES, FONT, SEQUENCE, WAVEFORM]

export const isTranscodingType = (type?: any): type is TranscodingType => {
  return TypesTranscoding.includes(type)
}

export function assertTranscodingType(type: any, name?: string): asserts type is TranscodingType {
  if (!isTranscodingType(type))
    errorThrow(type, 'TranscodingType', name)
}
