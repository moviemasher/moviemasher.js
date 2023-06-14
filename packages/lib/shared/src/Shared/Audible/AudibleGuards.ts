import type { AudibleInstance } from '@moviemasher/runtime-shared'
import type { AudibleAsset } from '@moviemasher/runtime-shared'

import { errorThrow } from '@moviemasher/runtime-shared'
import { isAsset } from '@moviemasher/runtime-shared'
import { isInstance } from '../Instance/InstanceGuards.js'
import { TypesAudible } from '@moviemasher/runtime-shared'

export const isAudibleAsset = (value: any): value is AudibleAsset => {
  return isAsset(value) && TypesAudible.includes(value.type)
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
