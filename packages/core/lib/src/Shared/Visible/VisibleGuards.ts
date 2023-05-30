import type { VisibleInstance } from '../Instance/Instance.js'
import type { VisibleAsset } from '../Asset/Asset.js'

import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { isAsset } from '../Asset/AssetGuards.js'
import { isInstance } from '../Instance/InstanceGuards.js'
import { TypesVisible } from '@moviemasher/runtime-shared'

export const isVisibleAsset = (value: any): value is VisibleAsset => {
  return isAsset(value) && TypesVisible.includes(value.type)
}

export function assertVisibleAsset(value: any, name?: string): asserts value is VisibleAsset {
  if (!isVisibleAsset(value)) errorThrow(value, 'VisibleAsset', name)
}

export const isVisibleInstance = (value: any): value is VisibleInstance => {
  return isInstance(value) && 'asset' in value && isVisibleAsset(value.asset) 
}

export function assertVisibleInstance(value: any, name?: string): asserts value is VisibleInstance {
  if (!isVisibleInstance(value)) errorThrow(value, 'VisibleInstance', name)
}
