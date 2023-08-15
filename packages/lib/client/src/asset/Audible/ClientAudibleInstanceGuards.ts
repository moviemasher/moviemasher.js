import type { ClientAudibleInstance } from '@moviemasher/runtime-client'

import { isAudibleInstance } from '@moviemasher/lib-shared'
import { isClientInstance } from '../../Client/ClientGuards.js'

export const isClientAudibleInstance = (value: any): value is ClientAudibleInstance => (
  isClientInstance(value) && isAudibleInstance(value)
)
