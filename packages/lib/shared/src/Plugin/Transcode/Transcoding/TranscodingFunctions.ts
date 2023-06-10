import type { 
  Transcoding, TranscodingTypes, TranscodingType 
} from './Transcoding.js'

import { isRequestable } from '../../../Base/Requestable/RequestableFunctions.js'
import { errorThrow } from '../../../Helpers/Error/ErrorFunctions.js'
import { TypeFont, TypeSequence, TypeWaveform } from "../../../Setup/EnumConstantsAndFunctions.js"
import { TypesAsset } from '@moviemasher/runtime-shared'



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