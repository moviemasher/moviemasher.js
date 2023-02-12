import { 
  RequestObject, LoadType, ProtocolPromise, Plugins, 
  LoadedFont, assertTrue, isPopulatedString, 
  LoadedInfo, endpointAbsolute, LoadedAudio, JsonType,
  ContentTypeCss, RequestInitObject, urlFromCss, endpointUrl, ImageType, AudioType, VideoType, FontType, ProtocolHttp, ProtocolHttps, errorThrow
} from "@moviemasher/moviemasher.js"
import { audioBufferPromise } from "../Utility/Audio"
import { jsonPromise } from "../Utility/Json"
import { clientImagePromise } from "../Utility/Image"
import { clientVideoPromise } from "../Utility/Video"

const arrayBufferPromise = (url: string, init?: RequestInitObject): Promise<ArrayBuffer> => (
   fetch(url, init).then(response => response.arrayBuffer())
)

const fontFamily = (url: string): string => url.replaceAll(/[^a-z0-9]/gi, '_')

const fontPromise =  (request: RequestObject): Promise<LoadedFont> => {
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
      const info: LoadedInfo = { family }
      // this.updateLoaderFile(file, info)
      return face
    })
  })
}

const audioPromise =  (request: RequestObject): Promise<LoadedAudio| any> => {
  const { endpoint, init } = request
  const url = endpointUrl(endpoint)
  // console.log(this.constructor.name, "audioPromise", isBlob ? 'BLOB' : url)
  const promise = arrayBufferPromise(url, init)
  return promise.then(buffer => audioBufferPromise(buffer))
}

const promise = ((request: RequestObject, type?: LoadType) => {
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
