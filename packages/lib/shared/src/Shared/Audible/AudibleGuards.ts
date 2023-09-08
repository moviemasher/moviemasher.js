import type { AudibleAsset, AudibleInstance } from '@moviemasher/runtime-shared'

import { AUDIBLE_TYPES, errorThrow, isAsset } from '@moviemasher/runtime-shared'
import { isInstance } from '../Instance/InstanceGuards.js'

export const isAudibleAsset = (value: any): value is AudibleAsset => {
  return isAsset(value) && AUDIBLE_TYPES.includes(value.type)
}

export function assertAudibleAsset(value: any, name?: string): asserts value is AudibleAsset {
  if (!isAudibleAsset(value)) errorThrow(value, 'AudibleAsset', name)
}

export const isAudibleInstance = (value: any): value is AudibleInstance => {
  return isInstance(value) && 'asset' in value && isAudibleAsset(value.asset) 
}

export function assertAudibleInstance(value: any, name?: string): asserts value is AudibleInstance {
  if (!isAudibleInstance(value)) errorThrow(value, 'AudibleInstance', name)
}
