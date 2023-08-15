import type { MediaEvent } from '@moviemasher/lib-server'
import type { JsonRecord } from '@moviemasher/runtime-shared'

import { jobExtract, jobPromise } from '@moviemasher/lib-server'

export const handler = async (event: MediaEvent, context: any) => {
  console.log('event', event)
  console.log('context', context)
  const bodyJson: JsonRecord = JSON.parse(event.body)
  const [jobType, mediaRequest] = jobExtract(bodyJson)
  return await jobPromise(jobType, mediaRequest)
}
