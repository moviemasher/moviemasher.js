import { isAssetType } from '@moviemasher/runtime-shared'
import type { Asset, AssetObject, SourceAssetObject } from './Asset.js'


import { isIdentified } from '../../Base/IdentifiedFunctions.js'
import { isTyped } from '../../Base/TypedFunctions.js'
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { isPopulatedString } from '../SharedGuards.js'

export const isAsset = (value: any): value is Asset => (
  isAssetObject(value)
)

export function assertAsset(value: any, name?: string): asserts value is Asset {
  if (!isAsset(value)) errorThrow(value, 'Asset', name)
}



export const isAssetObject = (value: any): value is AssetObject => (
  isIdentified(value) && isTyped(value) && isAssetType(value.type)
)

export function assertAssetObject(value: any, name?: string): asserts value is AssetObject {
  if (!isAssetObject(value)) errorThrow(value, 'AssetObject', name)
}


export const isSourceAssetObject = (value: any): value is SourceAssetObject => (
  isAssetObject(value) && isPopulatedString(value.source)
)

export function assertSourceAssetObject(value: any, name?: string): asserts value is SourceAssetObject {
  if (!isSourceAssetObject(value)) errorThrow(value, 'SourceAssetObject', name)
}