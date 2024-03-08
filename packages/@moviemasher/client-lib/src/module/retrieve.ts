import type { DataOrError, RetrieveFunction, StringDataOrError } from '@moviemasher/shared-lib/types.js'

import { ERROR, MOVIE_MASHER, errorCaught, errorPromise, isDefiniteError, namedError } from '@moviemasher/shared-lib/runtime.js'
import { isClientAudio, isClientImage, isClientVideo } from '@moviemasher/shared-lib/utility/guard.js'
import { assertDefined } from '@moviemasher/shared-lib/utility/guards.js'
import { requestUrl } from '@moviemasher/shared-lib/utility/request.js'

let _context: AudioContext | undefined = undefined

const audioContext = () => {
  if (_context) return _context 
  
  const Klass = AudioContext || window.webkitAudioContext
  return _context = new Klass()
}

export const audioRetrieveFunction: RetrieveFunction = resource => {
  assertDefined(resource)

  const result = { data: 'OK' }
  const { request } = resource
  const { response } = request
  if (isClientAudio(response)) return Promise.resolve(result)

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
    return new Promise<StringDataOrError>(resolve => {
      audioContext().decodeAudioData(
        data,
        data => { 
          if (!isVideo) request.response = data
          resolve(result) 
        },
        error => { resolve(errorCaught(error)) }
      )
    })
  })
}

export const videoRetrieveFunction: RetrieveFunction = resource => {
  assertDefined(resource)
  const result = { data: 'OK' }
  const { request } = resource
  const { response, resourcePromise } = request
  if (isClientVideo(response)) return Promise.resolve(result)

  if (resourcePromise) return resourcePromise

  const url = requestUrl(request)

  if (!url) return errorPromise(ERROR.Url, `requestVideoPromise`) 

  return request.resourcePromise = new Promise<StringDataOrError>(resolve => {
    const { document } = MOVIE_MASHER.window
    const video = document.createElement('video')
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
        delete request.resourcePromise
        resolve(result)
      }
    }
    video.onerror = error => { resolve(errorCaught(error)) }
    video.autoplay = false
    video.load()
  })
}

export const imageRetrieveFunction: RetrieveFunction = resource => {
  assertDefined(resource)
  const result = { data: 'OK' }
  const { request } = resource
  const { response, resourcePromise } = request
  if (isClientImage(response)) return Promise.resolve(result)

  if (resourcePromise) return resourcePromise

  return request.resourcePromise = urlRetrieveFunction(resource).then(orError => {
    if (isDefiniteError(orError)) return orError

    const { objectUrl } = request
    assertDefined(objectUrl)

    return new Promise<StringDataOrError>(resolve => {
      const data = new Image()
      data.onerror = error => { resolve(errorCaught(error)) }
      data.onload = () => {
        request.response = data
        delete request.resourcePromise
        resolve({ data: objectUrl })
      }
      data.src = objectUrl
    })
  })
}

export const urlRetrieveFunction: RetrieveFunction = resource => {
  assertDefined(resource)
  
  const { request } = resource
  const { objectUrl, urlPromise } = request
  if (objectUrl) return Promise.resolve({ data: objectUrl })

  if (urlPromise) return urlPromise

  const { init = {} } = request 
  const url = requestUrl(request)
  return request.urlPromise = fetch(url, init).then(response => response.blob()).then(blob => {
    const createdUrl = URL.createObjectURL(blob)
    if (!createdUrl) return namedError(ERROR.Url, url)

    request.objectUrl = createdUrl
    delete request.urlPromise
    return { data: createdUrl }
  }).catch(error => errorCaught(error))
}
