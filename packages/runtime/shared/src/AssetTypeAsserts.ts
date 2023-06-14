import type { AssetType } from './AssetType.js'

import { isAssetType } from './AssetTypeGuards.js'
import { errorThrow } from './ErrorFunctions.js'

export function assertAssetType(type: any, name?: string): asserts type is AssetType {
  if (!isAssetType(type)) errorThrow(type, 'AssetType', name)
}
