import type { EndpointRequest } from '@moviemasher/runtime-shared'
import type { ClientImageDataOrError } from '@moviemasher/runtime-client'

import { MovieMasher, EventTypeClientImage } from '@moviemasher/runtime-client'

import { errorCaught, errorPromise } from '@moviemasher/runtime-shared'
import { ErrorName } from '@moviemasher/runtime-shared'
import { requestUrl } from '../request/request.js'
import { ClientImageEvent } from '@moviemasher/runtime-client'


export const requestImagePromise = (request: EndpointRequest): Promise<ClientImageDataOrError> => {
  const url = requestUrl(request)
  if (!url) return errorPromise(ErrorName.Url)

  const { init } = request
  const promise = init ? Promise.resolve(url) : fetchBlobUrl(url, init)

  const loadPromise = promise.then(url => {
    console.debug('requestImagePromise', url)

    return new Promise<ClientImageDataOrError>(resolve => {
      const data = new Image()
      data.src = url
      data.onerror = error => {
        console.error('requestImagePromise.onerror', error)
        resolve(errorCaught(error))
      }
      data.onload = () => {
        console.log('requestImagePromise.onload', data)
        resolve({ data })
      }
    })
  })
  return loadPromise
}


const fetchBlobUrl = (url: string, init?: RequestInit) => (
  fetch(url, init)
    .then(response => response.blob())
    .then(blob => URL.createObjectURL(blob))
)

const ImageListener = (event: ClientImageEvent) => {
  const { detail } = event
  const { request } = detail
  detail.promise = requestImagePromise(request)
}

MovieMasher.eventDispatcher.addDispatchListener(EventTypeClientImage, ImageListener)
