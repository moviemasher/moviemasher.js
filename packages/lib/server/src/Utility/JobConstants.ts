import type { JobType, JobStatus } from '../Types/Job.js'


export const JOB_DECODING: JobType = 'decoding'
export const JOB_ENCODING: JobType = 'encoding'
export const JOB_TRANSCODING: JobType = 'transcoding'

export const JOB_TYPES = [JOB_DECODING, JOB_ENCODING, JOB_TRANSCODING]

export const JOB_STARTED: JobStatus = 'started'
export const JOB_FINISHED: JobStatus = 'finished'
export const JOB_ERRORED: JobStatus = 'errored'
