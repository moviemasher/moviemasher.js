import { 
  Request, LoadType, ProtocolPromise, Plugins, 
  ClientFont, assertTrue, isPopulatedString, 
  LoadedInfo, endpointAbsolute, ClientAudio, JsonType,
  ContentTypeCss, RequestInit, urlFromCss, endpointUrl, ImageType, AudioType, VideoType, FontType, ProtocolHttp, ProtocolHttps, errorThrow, ClientFontOrError
} from "@moviemasher/moviemasher.js"
import { audioBufferPromise } from "../Utility/Audio"
import { jsonPromise } from "../Utility/Json"
import { clientImagePromise } from "../Utility/Image"
import { clientVideoPromise } from "../Utility/Video"

const arrayBufferPromise = (url: string, init?: RequestInit): Promise<ArrayBuffer> => (
   fetch(url, init).then(response => response.arrayBuffer())
)

const fontFamily = (url: string): string => url.replaceAll(/[^a-z0-9]/gi, '_')

const fontPromise =  (request: Request): Promise<ClientFontOrError> => {
  const { endpoint, init } = request
  const url = endpointUrl(endpoint)
  
  const bufferPromise = fetch(url, init).then(response => {
    const type = response.headers.get('content-type') || ''
    console.log("fontPromise.fetch", type)
    if (!isPopulatedString(type) || type.startsWith(FontType)) {
      return response.arrayBuffer()
    }
    assertTrue(type.startsWith(ContentTypeCss)) 
    
    return response.text().then(string => {
      // TODO: use resolverPromise instead
      // return resolverPromise(string, type, FontType)
      const cssUrl = urlFromCss(string)
      console.log("fontPromise.fetch CSS", cssUrl)
      return arrayBufferPromise(cssUrl)
    })
  })
    
  const family = fontFamily(url)
  console.log("fontPromise", url)
  const facePromise = bufferPromise.then(buffer => {
    console.log("fontPromise.bufferPromise", url)
    const face = new FontFace(family, buffer)
    return face.load()
  })
  return facePromise.then(face => {
    console.log("fontPromise.facePromise", url)
    const { fonts } = globalThis.document
    fonts.add(face)
    return fonts.ready.then(() => {
      
      console.log("fontPromise.ready", url)
      // this.updateLoaderFile(file, info)
      return { clientFont: face }
    })
  })
}

const audioPromise =  (request: Request): Promise<ClientAudio| any> => {
  const { endpoint, init } = request
  const url = endpointUrl(endpoint)
  // console.log(this.constructor.name, "audioPromise", isBlob ? 'BLOB' : url)
  const promise = arrayBufferPromise(url, init)
  return promise.then(buffer => audioBufferPromise(buffer))
}

const promise = ((request: Request, type?: LoadType) => {
  const { endpoint, init } = request
  const absolute = endpointAbsolute(endpoint)
  const absoluteRequest = { init, endpoint: absolute }
  console.log('http promise', endpoint, absolute)
  switch (type) {
    case ImageType: return clientImagePromise(absoluteRequest)
    case AudioType: return audioPromise(absoluteRequest)
    case VideoType: return clientVideoPromise(absoluteRequest)
    case FontType: return fontPromise(absoluteRequest)
    case JsonType: return jsonPromise(absoluteRequest)
  }
  errorThrow(type, 'LoadType', 'type')
}) as ProtocolPromise

Plugins.protocols.http = { promise, type: ProtocolHttp }
Plugins.protocols.https = { promise, type: ProtocolHttps }
