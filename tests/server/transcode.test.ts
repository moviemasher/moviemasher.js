import type { AssetType, Data, EndpointRequest, RawType, StringData, TranscodeArgs, TranscodeOptions, Transcoding, TranscodingType } from '@moviemasher/shared-lib/types.js'

import { $AUDIO, $BITMAPS, $IMAGE, $TRANSCODE, $VIDEO, $WAVEFORM, MOVIE_MASHER, isDefiniteError, isTranscoding } from '@moviemasher/shared-lib/runtime.js'
import assert from 'node:assert'
import { describe, test } from 'node:test'
import { filePathExists } from '../../packages/@moviemasher/server-lib/src/module/file.js'
import { EventServerTranscodeStatus } from '../../packages/@moviemasher/server-lib/src/utility/events.js'

await MOVIE_MASHER.importPromise()


function failIfError<T = any>(orError: any): asserts orError is T {
  if (isDefiniteError(orError)) {
    console.trace(orError.error)
    assert.fail(orError.error.message)
    throw orError.error
  }
}

describe('Transcoding', () => {
  const transcode = async (transcodingType: TranscodingType, assetType: RawType, endpoint: string, id: string) => {
    const request: EndpointRequest = { endpoint }
    const options: TranscodeOptions = {}
    const transcodeArgs: TranscodeArgs = {
      resource: { request, type: assetType}, type: transcodingType, options
    }
    const jobOptions = { id, user: 'shared' }
    const transcodePromise = MOVIE_MASHER.promise(transcodeArgs, $TRANSCODE, jobOptions)
    assert(transcodePromise)
    const transcodeOrError = await transcodePromise
    failIfError<StringData>(transcodeOrError)
    return transcodeOrError.data
  }

  test.skip('transcodes image', async () => {
    const endpoint = '/moviemasher/temporary/assets/image/puppy/image.jpg'
    const transcodingType = $IMAGE
    const assetType = $IMAGE
    const id = 'image-transcode-image'
    const transcodedFilePath = await transcode(transcodingType, assetType, endpoint, id)
    assert(filePathExists(transcodedFilePath))

    const statusEvent = new EventServerTranscodeStatus(id)
    MOVIE_MASHER.dispatchCustom(statusEvent)
    const { promise: statusPromise } = statusEvent.detail
    assert(statusPromise)

    const statusOrError = await statusPromise
    failIfError<Data<Transcoding>>(statusOrError)

    const { data: transcodingObject } = statusOrError
    assert(isTranscoding(transcodingObject))
  })
  test.skip('transcodes video', async () => {
    const endpoint = '/moviemasher/temporary/assets/video/rgb.mp4'
    const transcodingType = $BITMAPS
    const assetType = $VIDEO
    const id = 'video-transcode-sequence'
    const transcodedFilePath = await transcode(transcodingType, assetType, endpoint, id)
    assert(filePathExists(transcodedFilePath))

    const statusEvent = new EventServerTranscodeStatus(id)
    MOVIE_MASHER.dispatchCustom(statusEvent)
    const { promise: statusPromise } = statusEvent.detail
    assert(statusPromise)

    const statusOrError = await statusPromise
    failIfError<Data<Transcoding>>(statusOrError)

    const { data: transcodingObject } = statusOrError
    assert(isTranscoding(transcodingObject))
  })

  test('transcodes audio to waveform', async () => {
    const endpoint = '/moviemasher/temporary/assets/video/rgb.mp4'
    const transcodingType = $WAVEFORM
    const assetType = $AUDIO
    const id = 'video-transcode-waveform'
    const transcodedFilePath = await transcode(transcodingType, assetType, endpoint, id)
    assert(filePathExists(transcodedFilePath))

    const statusEvent = new EventServerTranscodeStatus(id)
    MOVIE_MASHER.dispatchCustom(statusEvent)
    const { promise: statusPromise } = statusEvent.detail
    assert(statusPromise)

    const statusOrError = await statusPromise
    failIfError<Data<Transcoding>>(statusOrError)

    const { data: transcodingObject } = statusOrError
    assert(isTranscoding(transcodingObject))
  })
})

