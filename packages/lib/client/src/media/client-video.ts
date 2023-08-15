import type { ClientVideoDataOrError, MediaRequest } from '@moviemasher/runtime-client'

import { EventClientVideoPromise, MovieMasher } from '@moviemasher/runtime-client'
import { ErrorName, error, errorCaught, errorPromise } from '@moviemasher/runtime-shared'
import { requestUrl } from '../Client/request/request.js'
import { isClientVideo } from '../Client/ClientGuards.js'


export const requestVideoPromise = (request: MediaRequest): Promise<ClientVideoDataOrError> => {
  const { response } = request
  if (isClientVideo(response)) return Promise.resolve({ data: response })

  const url = requestUrl(request)
  // console.debug('requestVideoPromise', url, request)
  if (!url) return errorPromise(ErrorName.Url) 

  return new Promise<ClientVideoDataOrError>(resolve => {
    const video = globalThis.document.createElement('video')
    video.src = url
    video.oncanplay = () => {
      video.oncanplay = null
      video.onerror = null
      const { duration, videoWidth, clientWidth, videoHeight, clientHeight } = video
      const width = videoWidth || clientWidth
      const height = videoHeight || clientHeight
      if (!(width && height)) {
        resolve(error(ErrorName.ImportSize))
      } else if (!duration) {
        resolve(error(ErrorName.ImportDuration))
      } else {
        video.width = width
        video.height = height
        request.response = video
        resolve({ data: video })
      }
    }
    video.onerror = error => { resolve(errorCaught(error)) }
    video.autoplay = false
    video.load()
  })
}

const VideoListener = (event: EventClientVideoPromise) => {
  const { detail } = event
  const { request } = detail
  detail.promise = requestVideoPromise(request)
}

MovieMasher.eventDispatcher.addDispatchListener(EventClientVideoPromise.Type, VideoListener)

