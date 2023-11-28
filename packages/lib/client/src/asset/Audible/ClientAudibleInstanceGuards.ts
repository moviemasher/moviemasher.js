import type { ClientAudibleInstance } from '@moviemasher/runtime-client'
import type { AudibleInstance } from '@moviemasher/runtime-shared'

import { isClientInstance } from '../../guards/ClientGuards.js'
import { isAudibleAsset, isInstance } from '@moviemasher/lib-shared/utility/guards.js'

const isAudibleInstance = (value: any): value is AudibleInstance => {
  return isInstance(value) && 'asset' in value && isAudibleAsset(value.asset) 
}

export const isClientAudibleInstance = (value: any): value is ClientAudibleInstance => (
  isClientInstance(value) && isAudibleInstance(value)
)
