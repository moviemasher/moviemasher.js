export type DecodingJobType = 'decoding'
export type EncodingJobType = 'encoding'
export type TranscodingJobType = 'transcoding'
export type JobType = DecodingJobType | EncodingJobType | TranscodingJobType
export type JobStatus = 'errored' | 'finished' | 'started'
