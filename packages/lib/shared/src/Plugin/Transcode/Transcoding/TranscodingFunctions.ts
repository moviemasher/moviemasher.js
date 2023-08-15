import type { Transcoding, } from '@moviemasher/runtime-client'
import type { TranscodingType, TranscodingTypes } from '@moviemasher/runtime-shared'

import { TypeFont, TypeSequence, TypeWaveform, TypesAsset, errorThrow } from '@moviemasher/runtime-shared'
import { isRequestable } from '../../../Base/Requestable/RequestableFunctions.js'

export const TypesTranscoding: TranscodingTypes = [...TypesAsset, TypeFont, TypeSequence, TypeWaveform]

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
