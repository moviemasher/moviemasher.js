import type { EndpointRequest } from '@moviemasher/runtime-shared'
import type { ClientImageDataOrError } from '../../Helpers/ClientMedia/ClientMedia.js'

import { MovieMasher } from '@moviemasher/runtime-client'

import { errorCaught, errorPromise } from '../../Helpers/Error/ErrorFunctions.js'
import { ErrorName } from '../../Helpers/Error/ErrorName.js'
import { ProtocolBlob } from '../../Plugin/Protocol/Protocol.js'
import { requestUrl } from '../request/request.js'
import { ClientImageEvent } from '../../Helpers/ClientMedia/ClientMediaEvents.js'


export const requestImagePromise = (request: EndpointRequest): Promise<ClientImageDataOrError> => {
  const url = requestUrl(request)
  if (!url)
    return errorPromise(ErrorName.Url)


  const { init } = request
  const promise = url.startsWith(ProtocolBlob) ? Promise.resolve(url) : fetchBlobUrl(url, init)

  return promise.then(url => {
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

MovieMasher.eventDispatcher.addDispatchListener('clientimage', ImageListener)
