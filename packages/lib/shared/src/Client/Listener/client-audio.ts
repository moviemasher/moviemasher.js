import type { DataOrError } from '@moviemasher/runtime-shared'

import { MovieMasher } from '@moviemasher/runtime-client'
import type { ClientAudioEvent } from '../../Helpers/ClientMedia/ClientMediaEvents.js'
import { errorCaught, errorPromise } from '../../Helpers/Error/ErrorFunctions.js'
import { isDefiniteError } from '../../Shared/SharedGuards.js'
import { ClientAudioDataOrError } from '../../Helpers/ClientMedia/ClientMedia.js'
import { EndpointRequest } from '@moviemasher/runtime-shared'
import { requestUrl } from '../request/request.js'
import { ErrorName } from '../../Helpers/Error/ErrorName.js'


let _context: AudioContext | undefined = undefined

const audioContext = () => {
  if (_context) return _context 
  
  const Klass = AudioContext || window.webkitAudioContext
  return _context = new Klass()
}

export const requestAudioPromise = (request: EndpointRequest): Promise<ClientAudioDataOrError> => {
  const url = requestUrl(request)
  if (!url) return errorPromise(ErrorName.Url) 
  
  const { init } = request
  const blobPromise = fetch(url, init).then(response => response.blob())
  const bufferPromise = blobPromise.then(blob => (
    new Promise<DataOrError<ArrayBuffer>>(resolve => {
      const reader = new FileReader()
      reader.onload = (event: ProgressEvent<FileReader>) => { 
        const { loaded, total } = event
        if (loaded === total ) {
          const { result: data } = reader
          if (data instanceof ArrayBuffer) resolve({ data }) 
        }
      }
      reader.onerror = error => { resolve(errorCaught(error)) }
      reader.readAsArrayBuffer(blob)
    }) 
  ))
  return bufferPromise.then(orError => {
    if (isDefiniteError(orError)) return orError
    
    const { data } = orError
    return new Promise<ClientAudioDataOrError>(resolve => {
      audioContext().decodeAudioData(
        data,
        data => { resolve({ data }) },
        error => { resolve(errorCaught(error)) }
      )
    })
  })
}

const AudioListener = (event: ClientAudioEvent) => {
  const { detail } = event
  const { request } = detail
  detail.promise = requestAudioPromise(request)
}

MovieMasher.eventDispatcher.addDispatchListener('clientaudio', AudioListener)
