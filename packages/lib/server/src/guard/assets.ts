import type { ServerAudibleAsset, ServerVisibleAsset } from '../Types/ServerAssetTypes.js'

import { isAudibleAsset, isVisibleAsset } from '@moviemasher/lib-shared/utility/guards.js'
import { isServerAsset } from '@moviemasher/runtime-server'

export const isServerAudibleAsset = (value: any): value is ServerAudibleAsset => {
  return isServerAsset(value) && isAudibleAsset(value)
}

export const isServerVisibleAsset = (value: any): value is ServerVisibleAsset => {
  return isServerAsset(value) && isVisibleAsset(value)
}