import type { JsonRecord } from '@moviemasher/runtime-shared'

import { jsonParse } from '@moviemasher/runtime-shared'
import { jobExtract, jobPromise } from './Job.js'

interface MediaEvent {
  body: string
}

export const handler = async (event: MediaEvent, context: any) => {
  console.log('event', event)
  console.log('context', context)
  const bodyJson = jsonParse<JsonRecord>(event.body)
  const [jobType, mediaRequest] = jobExtract(bodyJson)
  return await jobPromise(jobType, mediaRequest)
}
