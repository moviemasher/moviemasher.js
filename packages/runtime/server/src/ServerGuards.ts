import type { ServerAsset } from './ServerAsset.js'

import { isAsset } from '@moviemasher/runtime-shared'

export const isServerAsset = (value: any): value is ServerAsset => {
  return isAsset(value) && 'assetGraphFiles' in value
}