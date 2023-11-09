import type { ClientAudioDataOrError, ClientFont, ClientFontDataOrError, ClientMediaRequest, ClientVideoDataOrError } from '@moviemasher/runtime-client'
import type { DataOrError } from '@moviemasher/runtime-shared'

import { CssMimetype, requestUrl, urlFromCss } from '@moviemasher/lib-shared'
import { EventClientAudioPromise, EventClientFontPromise, EventClientImagePromise, EventClientVideoPromise } from '@moviemasher/runtime-client'
import { ERROR, namedError, errorCaught, errorPromise, isDefiniteError } from '@moviemasher/runtime-shared'
import { isClientAudio, isClientVideo } from './Client/ClientGuards.js'
import { requestImagePromise } from './utility/request.js'

let _context: AudioContext | undefined = undefined

const audioContext = () => {
  if (_context) return _context 
  
  const Klass = AudioContext || window.webkitAudioContext
  return _context = new Klass()
}

const requestAudioPromise = (request: ClientMediaRequest): Promise<ClientAudioDataOrError> => {
  const { response } = request
  if (isClientAudio(response)) return Promise.resolve({ data: response })

  const isVideo = isClientVideo(response)
  const url = isVideo ? response.src : (request.objectUrl || requestUrl(request))
  if (!url) return errorPromise(ERROR.Url) 

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
          if (!isVideo) request.response = data
          resolve({ data }) 
        },
        error => { resolve(errorCaught(error)) }
      )
    })
  })
}

const requestFontPromise = (request: ClientMediaRequest): Promise<ClientFontDataOrError> => {
  const { response } = request
  if (response) return Promise.resolve({ data: response as ClientFont })

  const url = request.objectUrl || requestUrl(request)
  if (!url) return errorPromise(ERROR.Url)

  const { init } = request
  const family = url.replace(/[^a-z0-9]/gi, '_')

  // console.debug('requestFontPromise', url)
  const bufferPromise: Promise<ClientFontDataOrError> = fetch(url, init).then(response => {
    const mimetype = response.headers.get('content-type') || ''
    // console.log('fontPromise.fetch', type)
    if (!mimetype || mimetype.startsWith('font')) {
      return response.arrayBuffer().then(buffer => {
        // console.log('fontPromise.bufferPromise', url)
        const face = new FontFace(family, buffer)
        return face.load().then(() => ({ data: face }))
      })
    }

    //  mimetype does not match load type, try to load as css
    if (!mimetype.startsWith(CssMimetype))
      return namedError(ERROR.ImportType)

    return response.text().then(cssText => {
      const url = urlFromCss(cssText)
      if (!url)
        return namedError(ERROR.Url)

      return requestFontPromise({ endpoint: url })
    })
  })

  return bufferPromise.then(orError => {
    if (isDefiniteError(orError))
      return orError

    const { data } = orError
    const { fonts } = globalThis.document
    fonts.add(data)
    return fonts.ready.then(() => ({ data }))
  })
}

const requestVideoPromise = (request: ClientMediaRequest): Promise<ClientVideoDataOrError> => {
  const { response } = request
  if (isClientVideo(response)) return Promise.resolve({ data: response })

  const url = request.objectUrl || requestUrl(request)
  // console.debug('requestVideoPromise', url, request)
  if (!url) return errorPromise(ERROR.Url, `requestVideoPromise`) 

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
        resolve(namedError(ERROR.ImportSize))
      } else if (!duration) {
        resolve(namedError(ERROR.ImportDuration))
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

const AudioListener = (event: EventClientAudioPromise) => {
  const { detail } = event
  const { request } = detail
  detail.promise = requestAudioPromise(request)
}

const FontListener = (event: EventClientFontPromise) => {
  const { detail } = event
  const { request } = detail
  detail.promise = requestFontPromise(request)
}

const ImageListener = (event: EventClientImagePromise) => {
  const { detail } = event
  const { request } = detail
  detail.promise = requestImagePromise(request)
}

const VideoListener = (event: EventClientVideoPromise) => {
  const { detail } = event
  const { request } = detail
  detail.promise = requestVideoPromise(request)
}

// listen for client audio event
export const ClientAudioListeners = () => ({
  [EventClientAudioPromise.Type]: AudioListener
})

// listen for client font event
export const ClientFontListeners = () => ({
  [EventClientFontPromise.Type]: FontListener
})

// listen for client image event
export const ClientImageListeners = () => ({
  [EventClientImagePromise.Type]: ImageListener
})

// listen for client video event
export const ClientVideoListeners = () => ({
  [EventClientVideoPromise.Type]: VideoListener
})
