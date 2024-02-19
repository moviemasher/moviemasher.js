import type { TranscodeFunction } from '@moviemasher/shared-lib/types.js'

import { isRawResource, isTranscoding } from '@moviemasher/shared-lib/utility/guards.js'
import { ERROR, $POST, isDefiniteError, namedError, copyResource, errorPromise } from '@moviemasher/shared-lib/runtime.js'
import { requestCallbackPromise } from '../utility/request.js'

export const transcodeFunction: TranscodeFunction = (args, jobOptions = {}) => {
  const { progress } = jobOptions
  const resource = copyResource(args.resource)
  if (!isRawResource(resource)) return errorPromise(ERROR.Syntax, 'resource')

  progress?.do(1)
  const jsonRequest = { endpoint: 'transcode/start', init: { method: $POST } }
  return requestCallbackPromise(jsonRequest, progress, args).then(orError => {
    if (isDefiniteError(orError)) return orError
    
    progress?.did(1)
    const { data } = orError
    if (!isTranscoding(data)) return namedError(ERROR.Syntax, 'transcoding')

    return { data }
  })
}