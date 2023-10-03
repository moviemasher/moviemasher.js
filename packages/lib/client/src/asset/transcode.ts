import type { TranscodeArgs } from '@moviemasher/runtime-shared'

import { isTranscodingObject } from '@moviemasher/lib-shared'
import { EventClientTranscode, MovieMasher } from '@moviemasher/runtime-client'
import { ERROR, error, isDefiniteError } from '@moviemasher/runtime-shared'
import { requestCallbackPromise, requestPopulate } from '../utility/request.js'

export class TranscodeHandler {
  static handle(event: EventClientTranscode): void {
    event.stopImmediatePropagation()
    const { detail } = event
    const { asset, progress, transcodingType, options = {} } = detail

    const { request, type: assetType } = asset
    progress?.do(1)
    const jsonRequest = {
      endpoint: 'transcode/start', init: { method: 'POST' }
    }
    const transcodeArgs: TranscodeArgs = { assetType, request, transcodingType, options }
    const populated = requestPopulate(jsonRequest, transcodeArgs)
    console.debug(EventClientTranscode.Type, 'handle request', populated)

    detail.promise = requestCallbackPromise(populated).then(orError => {
      if (isDefiniteError(orError)) return orError
      progress?.did(1)

      const { data } = orError
      if (!isTranscodingObject(data)) return error(ERROR.Internal)

      return { data }
    })
  }
}

MovieMasher.eventDispatcher.addDispatchListener(EventClientTranscode.Type, TranscodeHandler.handle)
