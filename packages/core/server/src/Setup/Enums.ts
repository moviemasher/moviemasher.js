import { errorThrow } from "@moviemasher/lib-core"

export type DecodingJobType = 'decoding'
export type EncodingJobType = 'encoding'
export type TranscodingJobType = 'transcoding'

export type JobType = DecodingJobType | EncodingJobType | TranscodingJobType

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
