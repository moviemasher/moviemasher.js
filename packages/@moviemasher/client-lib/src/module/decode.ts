import type { DecodeFunction } from '@moviemasher/shared-lib/types.js'

import { $POST, ERROR, copyResource, errorPromise, isDecoding, isDefiniteError, namedError } from '@moviemasher/shared-lib/runtime.js'
import { isDropResource } from '@moviemasher/shared-lib/utility/guards.js'
import { requestCallbackPromise } from '../utility/request.js'

export const decodeFunction: DecodeFunction = (args, jobOptions = {}) => {
  const { progress } = jobOptions
  const resource = copyResource(args.resource)
  if (!isDropResource(resource)) return errorPromise(ERROR.Internal)

  progress?.do(1)
  const jsonRequest = { endpoint: 'decode/start', init: { method: $POST } }
  return requestCallbackPromise(jsonRequest, progress, args).then(orError => {
    if (isDefiniteError(orError)) return orError
    
    progress?.did(1)
    
    const { data } = orError
    if (isDecoding(data)) return { data }
    
    return namedError(ERROR.Syntax, 'decoding')
  })
}
