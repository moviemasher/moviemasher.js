import type { StringData, TranscodeOptions, TranscodingObject } from '@moviemasher/runtime-shared'

import { MovieMasher, EventServerTranscode, ServerMediaRequest, EventServerTranscodeStatus } from '@moviemasher/runtime-server'
import { IMAGE, isDefiniteError } from '@moviemasher/runtime-shared'
import assert from 'node:assert'
import { describe, test } from 'node:test'
import { ServerEventDispatcherModule } from '../../../packages/lib/server/src/Utility/ServerEventDispatcherModule.js'

import { pathResolvedToPrefix } from '../../../packages/lib/server/src/Utility/Request.js'
import { filePathExists } from '@moviemasher/lib-server'
import { isTranscoding, isTranscodingObject } from '@moviemasher/lib-shared'

MovieMasher.eventDispatcher = new ServerEventDispatcherModule()
await MovieMasher.importPromise


function failIfError<T = any>(orError: any): asserts orError is T {
  if (isDefiniteError(orError)) {
    console.error(orError.error)
    assert.fail(orError.error.message)
  }
}

describe('Transcoding', () => {
  test('transcodes', async () => {
    const endpoint = pathResolvedToPrefix('../shared/image/puppy/image.jpg')
    const transcodingType = IMAGE
    const assetType = IMAGE
    const request: ServerMediaRequest = { endpoint }
    const id = 'image-to-image'
    const options: TranscodeOptions = {}
    const transcodeEvent = new EventServerTranscode(transcodingType, assetType, request, id, options)
    MovieMasher.eventDispatcher.dispatch(transcodeEvent)
    const { promise: transcodePromise } = transcodeEvent.detail
    assert(transcodePromise)
    const transcodeOrError = await transcodePromise
    failIfError<StringData>(transcodeOrError)

    const { data: transcodedFilePath } = transcodeOrError
    assert(filePathExists(transcodedFilePath))

    const statusEvent = new EventServerTranscodeStatus(id)
    MovieMasher.eventDispatcher.dispatch(statusEvent)
    const { promise: statusPromise } = statusEvent.detail
    assert(statusPromise)
    const statusOrError = await statusPromise
    failIfError<TranscodingObject>(statusOrError)

    const { data: transcodingObject } = statusOrError
    console.log('transcodingObject', transcodingObject)

    assert(isTranscodingObject(transcodingObject))

  })
})

