import type { AssetType } from '@moviemasher/runtime-shared'

import { isAssetType } from '@moviemasher/runtime-shared'

import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'

export function assertAssetType(type: any, name?: string): asserts type is AssetType {
  if (!isAssetType(type)) errorThrow(type, 'AssetType', name)
}
