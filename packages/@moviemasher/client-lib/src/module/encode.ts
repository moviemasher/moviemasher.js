import type { EncodeFunction } from '@moviemasher/shared-lib/types.js'

import { isEncoding } from '@moviemasher/shared-lib/utility/guards.js'
import { ERROR, $POST, isDefiniteError, namedError } from '@moviemasher/shared-lib/runtime.js'
import { requestCallbackPromise } from '../utility/request.js'


export const encodeFunction: EncodeFunction = (args, jobOptions = {}) => {
  const { progress } = jobOptions

  progress?.do(1)
  const jsonRequest = {
    endpoint: 'encode/start', init: { method: $POST }
  }
  return requestCallbackPromise(jsonRequest, progress, args).then(orError => {
    if (isDefiniteError(orError)) return orError
    progress?.did(1)

    const { data } = orError
    if (!isEncoding(data)) return namedError(ERROR.Internal)

    return { data }
  })
}
