import type { DecodingObject, EncodingObject, TranscodingObject } from '@moviemasher/runtime-shared'

import { isAssetType, isDecodingType } from '@moviemasher/runtime-shared'
import { isRequestable } from './Base/Requestable/RequestableFunctions.js'
import { isTranscodingType } from './Transcoding/TranscodingGuards.js'

export const isEncodingObject = (value: any): value is EncodingObject => {
  return isRequestable(value) && isAssetType(value.type)
}

export const isDecodingObject = (value: any): value is DecodingObject => {
  return isRequestable(value) && isDecodingType(value.type)
}

export const isTranscodingObject = (value: any): value is TranscodingObject => {
  return isRequestable(value) && isTranscodingType(value.type)
}

