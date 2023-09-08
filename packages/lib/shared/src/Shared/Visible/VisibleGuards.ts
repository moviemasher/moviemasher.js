import type { VisibleAsset, VisibleInstance } from '@moviemasher/runtime-shared'

import { VISIBLE_TYPES, errorThrow, isAsset } from '@moviemasher/runtime-shared'
import { isInstance } from '../Instance/InstanceGuards.js'

export const isVisibleAsset = (value: any): value is VisibleAsset => {
  return isAsset(value) && VISIBLE_TYPES.includes(value.type)
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
