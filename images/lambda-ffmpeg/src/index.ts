import type { JsonRecord } from '@moviemasher/lib-core'
import type { MediaEvent } from '@moviemasher/server-core'

import { jobPromise, jobExtract } from '@moviemasher/server-core'

export const handler = async (event: MediaEvent, context: any) => {
  console.log('event', event)
  console.log('context', context)
  const bodyJson: JsonRecord = JSON.parse(event.body)
  const [jobType, mediaRequest] = jobExtract(bodyJson)
  return await jobPromise(jobType, mediaRequest)
}
