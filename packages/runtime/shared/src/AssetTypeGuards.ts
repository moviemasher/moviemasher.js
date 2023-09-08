import type { AssetType, AudibleType, VisibleType } from './AssetType.js'
import { ASSET_TYPES, AUDIBLE_TYPES, VISIBLE_TYPES } from './AssetTypeConstants.js'

export const isAssetType = (value?: any): value is AssetType => (
  ASSET_TYPES.includes(value)
)

export const isAudibleAssetType = (value?: any): value is AudibleType => (
  AUDIBLE_TYPES.includes(value)
)

export const isVisibleAssetType = (value?: any): value is VisibleType => (
  VISIBLE_TYPES.includes(value)
)
