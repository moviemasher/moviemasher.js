import type { DecodeArgs, ListenersFunction } from '@moviemasher/shared-lib/types.js'

import { EventClientDecode } from '../utility/events.js'
import { ERROR, POST, isDecoding, isDefiniteError, namedError } from '@moviemasher/shared-lib/runtime.js'
import { requestCallbackPromise } from '../utility/request.js'

export class DecodeHandler {
  static handle(event: EventClientDecode): void {
    event.stopImmediatePropagation()
    const { detail } = event
    const { asset, progress, decodingType, options = {} } = detail
    const { request, type: assetType } = asset
    progress?.do(1)
    const jsonRequest = {
      endpoint: 'decode/start', init: { method: POST }
    }
    const decodeArgs: DecodeArgs = { assetType, request, decodingType, options }

    detail.promise = requestCallbackPromise(jsonRequest, progress, decodeArgs).then(orError => {
      if (isDefiniteError(orError)) return orError
      progress?.did(1)

      const { data } = orError
      if (!isDecoding(data)) return namedError(ERROR.Internal)

      return { data }
    })
  }
}

// listen for client decode event
export const decodeClientListeners: ListenersFunction = () => ({
  [EventClientDecode.Type]: DecodeHandler.handle
})
