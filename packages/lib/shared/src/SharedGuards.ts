import { Encoding, isAssetType, type Transcoding } from '@moviemasher/runtime-shared'

import { isRequestable } from './Base/Requestable/RequestableFunctions.js'
import { isTranscodingType } from './TranscodingGuards.js'

export const isTranscoding = (value: any): value is Transcoding => {
  return isRequestable(value) && isTranscodingType(value.type)
}

export const isEncoding = (value: any): value is Encoding => {
  return isRequestable(value) && isAssetType(value.type)
}

