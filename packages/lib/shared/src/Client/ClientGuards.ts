import type { ClientInstance, ClientVisibleInstance } from '@moviemasher/runtime-client'

import { isClientAsset } from '@moviemasher/runtime-client'
import { errorThrow } from '@moviemasher/runtime-shared'
import { isInstance } from '../Shared/Instance/InstanceGuards.js'
import { isVisibleInstance } from '../Shared/Visible/VisibleGuards.js'

export const isClientInstance = (value: any): value is ClientInstance => {
  return isInstance(value) && 'asset' in value && isClientAsset(value.asset) 
}

export const isClientVisibleInstance = (value: any): value is ClientVisibleInstance => {
  return isClientInstance(value) && isVisibleInstance(value) 
}

export function assertClientVisibleInstance(value: any, name?: string): asserts value is ClientVisibleInstance {
  if (!isClientVisibleInstance(value)) errorThrow(value, 'ClientVisibleInstance', name)
}
