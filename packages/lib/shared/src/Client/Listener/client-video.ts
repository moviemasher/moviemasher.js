import { error, errorCaught } from '@moviemasher/runtime-shared'
import { ErrorName } from '@moviemasher/runtime-shared'
import { EndpointRequest } from '@moviemasher/runtime-shared'
import { ClientVideoDataOrError } from '../../Helpers/ClientMedia/ClientMedia.js'
import { requestUrl } from '../request/request.js'
import { ClientVideoEvent } from '../../Helpers/ClientMedia/ClientMediaEvents.js'
import { MovieMasher } from '@moviemasher/runtime-client'


export const requestVideoPromise = (request: EndpointRequest): Promise<ClientVideoDataOrError> => {
  const url = requestUrl(request)
  if (!url)
    return Promise.reject(new Error('url'))

  console.debug('requestVideoPromise', url)

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
        resolve({ data: video })
      }
    }
    video.onerror = error => { resolve(errorCaught(error)) }
    video.autoplay = false
    video.load()
  })
}

const VideoListener = (event: ClientVideoEvent) => {
  const { detail } = event
  const { request } = detail
  detail.promise = requestVideoPromise(request)
}

MovieMasher.eventDispatcher.addDispatchListener('clientvideo', VideoListener)

