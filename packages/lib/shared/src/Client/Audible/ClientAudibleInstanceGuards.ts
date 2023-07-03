import { isAudibleInstance } from '../../Shared/Audible/AudibleGuards.js'
import { isClientInstance } from '../ClientGuards.js'
import type { ClientAudibleInstance } from '@moviemasher/runtime-client'

export const isClientAudibleInstance = (value: any): value is ClientAudibleInstance => (
  isClientInstance(value) && isAudibleInstance(value)
)
