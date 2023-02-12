import { errorThrow } from "@moviemasher/moviemasher.js"

export enum JobType {
  Decoding = 'decoding',
  Encoding = 'encoding',
  Transcoding = 'transcoding',
}

export const JobTypes = Object.values(JobType)
export const isJobType = (value: any): value is JobType => {
  return JobTypes.includes(value as JobType)
}
export function assertJobType(value: any, name?: string): asserts value is JobType {
  if (!isJobType(value)) errorThrow(value, 'JobType', name) 
}
