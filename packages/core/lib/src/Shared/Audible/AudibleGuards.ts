import type { AudibleInstance } from '../Instance/Instance.js'
import type { AudibleAsset } from '../Asset/Asset.js'

import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { isAsset } from '../Asset/AssetGuards.js'
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
