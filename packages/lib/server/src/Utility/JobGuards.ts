import type { JobType } from '../Types/Job.js'
import type { JobProduct } from '@moviemasher/runtime-shared'

import { errorThrow, isIdentified, isTyped } from '@moviemasher/runtime-shared'
import { JOB_TYPES } from './JobConstants.js'

export const isJobType = (value: any): value is JobType => {
  return JOB_TYPES.includes(value as JobType)
}
export function assertJobType(value: any, name?: string): asserts value is JobType {
  if (!isJobType(value)) errorThrow(value, 'JobType', name) 
}

export const isJobProduct = (value: any): value is JobProduct => {
  return isTyped(value) && isIdentified(value)
}
