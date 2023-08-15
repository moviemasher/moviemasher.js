import type { ClientAudioDataOrError, MediaRequest } from '@moviemasher/runtime-client'
import type { DataOrError } from '@moviemasher/runtime-shared'

import { EventClientAudioPromise, MovieMasher } from '@moviemasher/runtime-client'
import { ErrorName, errorCaught, errorPromise, isDefiniteError } from '@moviemasher/runtime-shared'
import { isClientAudio, isClientVideo } from '../Client/ClientGuards.js'
import { requestUrl } from '../Client/request/request.js'

let _context: AudioContext | undefined = undefined

const audioContext = () => {
  if (_context) return _context 
  
  const Klass = AudioContext || window.webkitAudioContext
  return _context = new Klass()
}

export const requestAudioPromise = (request: MediaRequest): Promise<ClientAudioDataOrError> => {
  const { response } = request
  if (isClientAudio(response)) return Promise.resolve({ data: response })

  const responseIsVideo = isClientVideo(response)
  const url = responseIsVideo ? response.src : requestUrl(request)
  if (!url) return errorPromise(ErrorName.Url) 

  const { init } = request
  const blobPromise = fetch(url, init).then(response => response.blob())
  const bufferPromise = blobPromise.then(blob => {
    return new Promise<DataOrError<ArrayBuffer>>(resolve => {
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
  })
  return bufferPromise.then(orError => {
    if (isDefiniteError(orError)) return orError
    
    const { data } = orError
    return new Promise<ClientAudioDataOrError>(resolve => {
      audioContext().decodeAudioData(
        data,
        data => { 
          if (!responseIsVideo) request.response = data
          resolve({ data }) 
        },
        error => { resolve(errorCaught(error)) }
      )
    })
  })
}

const AudioListener = (event: EventClientAudioPromise) => {
  const { detail } = event
  const { request } = detail
  detail.promise = requestAudioPromise(request)
}

MovieMasher.eventDispatcher.addDispatchListener(EventClientAudioPromise.Type, AudioListener)
