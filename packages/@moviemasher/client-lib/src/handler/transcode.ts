import type { ClientMediaRequest, ListenersFunction, TranscodeArgs } from '@moviemasher/shared-lib/types.js'

import { isTranscoding } from '@moviemasher/shared-lib/utility/guards.js'
import { EventClientTranscode } from '../utility/events.js'
import { ERROR, POST, isDefiniteError, namedError } from '@moviemasher/shared-lib/runtime.js'
import { requestCallbackPromise } from '../utility/request.js'

export class TranscodeHandler {
  static handle(event: EventClientTranscode): void {
    event.stopImmediatePropagation()
    const { detail } = event
    const { asset, progress, transcodingType, options = {} } = detail

    const { request: assetRequest, type: assetType } = asset

    
    const { response, file, objectUrl, ...request } = assetRequest as ClientMediaRequest

    progress?.do(1)
    const jsonRequest = {
      endpoint: 'transcode/start', init: { method: POST }
    }
    const transcodeArgs: TranscodeArgs = { assetType, request, transcodingType, options }
    detail.promise = requestCallbackPromise(jsonRequest, progress, transcodeArgs).then(orError => {
      // console.debug(EventClientTranscode.Type, 'handle response', orError)
      if (isDefiniteError(orError)) return orError
      progress?.did(1)

      const { data } = orError
      if (!isTranscoding(data)) return namedError(ERROR.Internal)

      return { data }
    })
  }
}

// listen for client transcode event
export const transcodeClientListeners: ListenersFunction = () => ({
  [EventClientTranscode.Type]: TranscodeHandler.handle
})
