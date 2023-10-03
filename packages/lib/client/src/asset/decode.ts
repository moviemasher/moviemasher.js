import type { DecodeArgs } from '@moviemasher/runtime-shared'

import { isDecodingObject } from '@moviemasher/lib-shared'
import { EventClientDecode, MovieMasher } from '@moviemasher/runtime-client'
import { ERROR, error, isDefiniteError } from '@moviemasher/runtime-shared'
import { requestCallbackPromise, requestPopulate } from '../utility/request.js'

export class DecodeHandler {
  static handle(event: EventClientDecode): void {
    event.stopImmediatePropagation()
    const { detail } = event
    const { asset, progress, decodingType, options = {} } = detail
    const { request, type: assetType } = asset
    progress?.do(1)
    const jsonRequest = {
      endpoint: 'decode/start', init: { method: 'POST' }
    }
    const decodeArgs: DecodeArgs = { assetType, request, decodingType, options }
    const populated = requestPopulate(jsonRequest, decodeArgs)
    console.debug(EventClientDecode.Type, 'handle request', populated)

    detail.promise = requestCallbackPromise(populated).then(orError => {
      if (isDefiniteError(orError)) return orError
      progress?.did(1)

      const { data } = orError
      if (!isDecodingObject(data)) return error(ERROR.Internal)

      return { data }
    })
  }
}

MovieMasher.eventDispatcher.addDispatchListener(EventClientDecode.Type, DecodeHandler.handle)
