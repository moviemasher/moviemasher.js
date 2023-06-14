import type { AssetType, AudibleType, VisibleType } from './AssetType.js'
import { TypesAsset, TypesAudible, TypesVisible } from './AssetTypeConstants.js'

export const isAssetType = (value?: any): value is AssetType => (
  TypesAsset.includes(value)
)

export const isAudibleAssetType = (value?: any): value is AudibleType => (
  TypesAudible.includes(value)
)

export const isVisibleAssetType = (value?: any): value is VisibleType => (
  TypesVisible.includes(value)
)
