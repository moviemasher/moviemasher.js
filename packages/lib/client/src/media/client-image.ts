import type { ClientImageDataOrError, ClientMediaRequest } from '@moviemasher/runtime-client'

import { EventClientImagePromise, MovieMasher } from '@moviemasher/runtime-client'
import { ERROR, errorCaught, errorPromise } from '@moviemasher/runtime-shared'
import { requestUrl } from '@moviemasher/lib-shared'
import { isClientImage } from '../Client/ClientGuards.js'

export const requestImagePromise = (request: ClientMediaRequest): Promise<ClientImageDataOrError> => {
  const { response } = request
  if (isClientImage(response)) return Promise.resolve({ data: response })

  const url = request.objectUrl || requestUrl(request)
  if (!url) return errorPromise(ERROR.Url)

  const loadPromise = urlPromise(url, request).then(url => {
    return new Promise<ClientImageDataOrError>(resolve => {
      const data = new Image()
      data.src = url
      data.onerror = error => {
        console.error('requestImagePromise.onerror', error)
        resolve(errorCaught(error))
      }
      data.onload = () => {
        request.response = data
        resolve({ data })
      }
    })
  })
  return loadPromise
}

const urlPromise = (url: string, request: ClientMediaRequest) => {
  const { init } = request 
  if (!init) return Promise.resolve(url) 

  return fetch(url, init)
    .then(response => response.blob())
    .then(blob => request.objectUrl = URL.createObjectURL(blob))
}

const ImageListener = (event: EventClientImagePromise) => {
  const { detail } = event
  const { request } = detail
  detail.promise = requestImagePromise(request)
}

MovieMasher.eventDispatcher.addDispatchListener(EventClientImagePromise.Type, ImageListener)
