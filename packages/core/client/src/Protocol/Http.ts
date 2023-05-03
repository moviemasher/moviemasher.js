import type {
  ClientAudioDataOrError, ClientFontDataOrError, EndpointRequest, RequestInit, 
  ProtocolPromise, LoadType, 
} from '@moviemasher/lib-core'

import { 
  assertEndpoint, TypeAudio, ProtocolHttps, ProtocolHttp, 
  endpointAbsolute, endpointUrl, errorThrow, TypeFont, 
  TypeImage, isPopulatedString, 
  TypeProtocol, TypeRecords, TypeRecord, 
  Runtime, TypeVideo, pluginDataOrErrorPromise, TypeResolve, isDefiniteError
} from '@moviemasher/lib-core'
import { audioBufferPromise } from '../Utility/Audio.js'
import { imageDataPromise } from '../Utility/Image.js'
import { jsonPromise } from '../Utility/Json.js'
import { videoDataPromise } from '../Utility/Video.js'

const arrayBufferPromise = (url: string, init?: RequestInit): Promise<ArrayBuffer> => (
   fetch(url, init).then(response => response.arrayBuffer())
)

const fontFamily = (url: string): string => url.replace(/[^a-z0-9]/gi, '_')
 
const fontPromise =  (request: EndpointRequest): Promise<ClientFontDataOrError> => {
  const { endpoint, init } = request
  assertEndpoint(endpoint)

  const url = endpointUrl(endpoint)
  const family = fontFamily(url)

  const bufferPromise = fetch(url, init).then(response => {
    const mimetype = response.headers.get('content-type') || ''
    // console.log('fontPromise.fetch', type)
    if (!isPopulatedString(mimetype) || mimetype.startsWith(TypeFont)) {
      return response.arrayBuffer().then(buffer => {
        // console.log('fontPromise.bufferPromise', url)
        const face = new FontFace(family, buffer)
        return face.load().then(data => ({ data }))
      })
    }
    //  mimetype does not match load type - see if there is resolver
    return pluginDataOrErrorPromise(mimetype, TypeResolve).then(orError => {
      if (isDefiniteError(orError)) return orError
      
      const { data: resolvePlugin } = orError
      return response.text().then(string => (
        resolvePlugin.promise(string, TypeFont)
      ))
    })
  })
  return bufferPromise.then(orError => {
    if (isDefiniteError(orError)) return orError
    const { data: face } = orError
    const { fonts } = globalThis.document
    fonts.add(face)
    return fonts.ready.then(() => ({ data: face }))
  })
}

const audioPromise =  (request: EndpointRequest): Promise<ClientAudioDataOrError> => {
  const { endpoint, init } = request
  assertEndpoint(endpoint)

  const url = endpointUrl(endpoint)
  // console.log(this.constructor.name, 'audioPromise', isBlob ? 'BLOB' : url)
  return arrayBufferPromise(url, init).then(audioBufferPromise)
}

const promise: ProtocolPromise = ((request: EndpointRequest, type?: LoadType) => {
  const { endpoint, init } = request
  assertEndpoint(endpoint)

  const absolute = endpointAbsolute(endpoint)
  const absoluteRequest = { init, endpoint: absolute }
  // console.log('http promise', endpoint, absolute)
  switch (type) {
    case TypeImage: return imageDataPromise(absoluteRequest)
    case TypeAudio: return audioPromise(absoluteRequest)
    case TypeVideo: return videoDataPromise(absoluteRequest)
    case TypeFont: return fontPromise(absoluteRequest)
    case TypeRecord: return jsonPromise(absoluteRequest) 
    case TypeRecords: return jsonPromise(absoluteRequest)
  }
  errorThrow(type, 'LoadType', 'type')
}) 

Runtime.plugins[TypeProtocol][ProtocolHttp] ||= { promise, type: TypeProtocol, protocol: ProtocolHttp }
Runtime.plugins[TypeProtocol][ProtocolHttps] ||= { promise, type: TypeProtocol, protocol: ProtocolHttps }
