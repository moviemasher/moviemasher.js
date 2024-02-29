import type { Data, StringData, TranscodeOptions, Transcoding, EndpointRequest } from '@moviemasher/shared-lib/types.js'

import { filePathExists } from '@moviemasher/server-lib'
import { isTranscoding, MOVIE_MASHER } from '@moviemasher/shared-lib'
import { EventServerTranscode, EventServerTranscodeStatus } from '@moviemasher/server-lib/runtime.js'
import { $AUDIO, $IMAGE, isDefiniteError, $BITMAPS, $VIDEO, $WAVEFORM } from '@moviemasher/shared-lib/runtime.js'
import assert from 'node:assert'
import { describe, test } from 'node:test'

await MOVIE_MASHER.importPromise()


function failIfError<T = any>(orError: any): asserts orError is T {
  if (isDefiniteError(orError)) {
    console.trace(orError.error)
    assert.fail(orError.error.message)
    throw orError.error
  }
}

describe('Transcoding', () => {
  test.skip('transcodes image', async () => {
    const endpoint = '/app/temporary/assets/image/puppy/image.jpg'
    const transcodingType = $IMAGE
    const assetType = $IMAGE
    const request: EndpointRequest = { endpoint }
    const id = 'image-transcode-image'
    const options: TranscodeOptions = {}
    const transcodeEvent = new EventServerTranscode(transcodingType, assetType, request, 'shared', id, options)
    MOVIE_MASHER.dispatch(transcodeEvent)
    const { promise: transcodePromise } = transcodeEvent.detail
    assert(transcodePromise)
    const transcodeOrError = await transcodePromise
    failIfError<StringData>(transcodeOrError)

    const { data: transcodedFilePath } = transcodeOrError
    assert(filePathExists(transcodedFilePath))

    const statusEvent = new EventServerTranscodeStatus(id)
    MOVIE_MASHER.dispatch(statusEvent)
    const { promise: statusPromise } = statusEvent.detail
    assert(statusPromise)

    const statusOrError = await statusPromise
    failIfError<Data<Transcoding>>(statusOrError)

    const { data: transcodingObject } = statusOrError
    assert(isTranscoding(transcodingObject))
  })
  test.skip('transcodes video', async () => {
    const endpoint = '/app/temporary/assets/video/rgb.mp4'
    const transcodingType = $BITMAPS
    const assetType = $VIDEO
    const request: EndpointRequest = { endpoint }
    const id = 'video-transcode-sequence'
    const options: TranscodeOptions = {}
    const transcodeEvent = new EventServerTranscode(transcodingType, assetType, request, 'shared', id, options)
    MOVIE_MASHER.dispatch(transcodeEvent)
    const { promise: transcodePromise } = transcodeEvent.detail
    assert(transcodePromise)
    const transcodeOrError = await transcodePromise
    failIfError<StringData>(transcodeOrError)

    // const { data: transcodedFilePath } = transcodeOrError
    // assert(filePathExists(transcodedFilePath))

    const statusEvent = new EventServerTranscodeStatus(id)
    MOVIE_MASHER.dispatch(statusEvent)
    const { promise: statusPromise } = statusEvent.detail
    assert(statusPromise)

    const statusOrError = await statusPromise
    failIfError<Data<Transcoding>>(statusOrError)

    const { data: transcodingObject } = statusOrError
    assert(isTranscoding(transcodingObject))
  })

  test('transcodes audio to waveform', async () => {
    const endpoint = '/app/temporary/assets/video/rgb.mp4'
    const transcodingType = $WAVEFORM
    const assetType = $AUDIO
    const request: EndpointRequest = { endpoint }
    const id = 'video-transcode-waveform'
    const options: TranscodeOptions = {}
    const transcodeEvent = new EventServerTranscode(transcodingType, assetType, request, 'shared', id, options)
    MOVIE_MASHER.dispatch(transcodeEvent)
    const { promise: transcodePromise } = transcodeEvent.detail
    assert(transcodePromise)
    const transcodeOrError = await transcodePromise
    failIfError<StringData>(transcodeOrError)

    const statusEvent = new EventServerTranscodeStatus(id)
    MOVIE_MASHER.dispatch(statusEvent)
    const { promise: statusPromise } = statusEvent.detail
    assert(statusPromise)

    const statusOrError = await statusPromise
    failIfError<Data<Transcoding>>(statusOrError)

    const { data: transcodingObject } = statusOrError
    assert(isTranscoding(transcodingObject))
  })
})

