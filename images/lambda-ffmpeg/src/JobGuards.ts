import type { JobType } from '@moviemasher/lib-server/src/Types/JobTypes.js'

import { errorThrow } from '@moviemasher/runtime-shared'

export const JobTypeDecoding: JobType = 'decoding'
export const JobTypeEncoding: JobType = 'encoding'
export const JobTypeTranscoding: JobType = 'transcoding'

export const JobTypes = [JobTypeDecoding, JobTypeEncoding, JobTypeTranscoding]

export const isJobType = (value: any): value is JobType => {
  return JobTypes.includes(value as JobType)
}
export function assertJobType(value: any, name?: string): asserts value is JobType {
  if (!isJobType(value)) errorThrow(value, 'JobType', name) 
}
