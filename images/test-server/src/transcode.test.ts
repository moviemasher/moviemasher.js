import type { Data, StringData, TranscodeOptions, Transcoding } from '@moviemasher/runtime-shared'

import { filePathExists, ServerEventDispatcherModule } from '@moviemasher/lib-server'
import { isTranscoding } from '@moviemasher/lib-shared'
import { EventServerTranscode, EventServerTranscodeStatus, MOVIEMASHER_SERVER, ServerMediaRequest } from '@moviemasher/runtime-server'
import { IMAGE, isDefiniteError, SEQUENCE, VIDEO } from '@moviemasher/runtime-shared'
import assert from 'node:assert'
import { describe, test } from 'node:test'

MOVIEMASHER_SERVER.eventDispatcher = new ServerEventDispatcherModule()
await MOVIEMASHER_SERVER.importPromise


function failIfError<T = any>(orError: any): asserts orError is T {
  if (isDefiniteError(orError)) {
    console.trace(orError.error)
    assert.fail(orError.error.message)
    throw orError.error
  }
}

describe('Transcoding', () => {
  test('transcodes image', async () => {
    const endpoint = '/app/dev/shared/image/puppy/image.jpg'
    const transcodingType = IMAGE
    const assetType = IMAGE
    const request: ServerMediaRequest = { endpoint }
    const id = 'image-transcode-image'
    const options: TranscodeOptions = {}
    const transcodeEvent = new EventServerTranscode(transcodingType, assetType, request, 'shared', id, options)
    MOVIEMASHER_SERVER.eventDispatcher.dispatch(transcodeEvent)
    const { promise: transcodePromise } = transcodeEvent.detail
    assert(transcodePromise)
    const transcodeOrError = await transcodePromise
    failIfError<StringData>(transcodeOrError)

    const { data: transcodedFilePath } = transcodeOrError
    assert(filePathExists(transcodedFilePath))

    const statusEvent = new EventServerTranscodeStatus(id)
    MOVIEMASHER_SERVER.eventDispatcher.dispatch(statusEvent)
    const { promise: statusPromise } = statusEvent.detail
    assert(statusPromise)

    const statusOrError = await statusPromise
    failIfError<Data<Transcoding>>(statusOrError)

    const { data: transcodingObject } = statusOrError
    assert(isTranscoding(transcodingObject))
  })
  test('transcodes video', async () => {
    const endpoint = '/app/dev/shared/video/rgb.mp4'
    const transcodingType = SEQUENCE
    const assetType = VIDEO
    const request: ServerMediaRequest = { endpoint }
    const id = 'video-transcode-sequence'
    const options: TranscodeOptions = {}
    const transcodeEvent = new EventServerTranscode(transcodingType, assetType, request, 'shared', id, options)
    MOVIEMASHER_SERVER.eventDispatcher.dispatch(transcodeEvent)
    const { promise: transcodePromise } = transcodeEvent.detail
    assert(transcodePromise)
    const transcodeOrError = await transcodePromise
    failIfError<StringData>(transcodeOrError)

    // const { data: transcodedFilePath } = transcodeOrError
    // assert(filePathExists(transcodedFilePath))

    const statusEvent = new EventServerTranscodeStatus(id)
    MOVIEMASHER_SERVER.eventDispatcher.dispatch(statusEvent)
    const { promise: statusPromise } = statusEvent.detail
    assert(statusPromise)

    const statusOrError = await statusPromise
    failIfError<Data<Transcoding>>(statusOrError)

    const { data: transcodingObject } = statusOrError
    assert(isTranscoding(transcodingObject))
  })
})

