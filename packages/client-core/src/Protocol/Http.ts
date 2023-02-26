import { 
  Request, LoadType, ProtocolPromise, Plugins, 
  assertTrue, isPopulatedString, 
  endpointAbsolute, 
  CssContentType, RequestInit, urlFromCss, endpointUrl, ImageType, AudioType, VideoType, FontType, HttpProtocol, HttpsProtocol, errorThrow, FontDataOrError, ProtocolType, assertEndpoint, RecordType, RecordsType, AudioDataOrError
} from "@moviemasher/moviemasher.js"
import { audioBufferPromise } from "../Utility/Audio"
import { jsonPromise } from "../Utility/Json"
import { imageDataPromise } from "../Utility/Image"
import { videoDataPromise } from "../Utility/Video"

const arrayBufferPromise = (url: string, init?: RequestInit): Promise<ArrayBuffer> => (
   fetch(url, init).then(response => response.arrayBuffer())
)

const fontFamily = (url: string): string => url.replaceAll(/[^a-z0-9]/gi, '_')

const fontPromise =  (request: Request): Promise<FontDataOrError> => {
  const { endpoint, init } = request
  assertEndpoint(endpoint)

  const url = endpointUrl(endpoint)
  
  const bufferPromise = fetch(url, init).then(response => {
    const type = response.headers.get('content-type') || ''
    // console.log("fontPromise.fetch", type)
    if (!isPopulatedString(type) || type.startsWith(FontType)) {
      return response.arrayBuffer()
    }
    assertTrue(type.startsWith(CssContentType)) 
    
    return response.text().then(string => {
      // TODO: use resolverPromise instead
      // return resolverPromise(string, type, FontType)
      const cssUrl = urlFromCss(string)
      // console.log("fontPromise.fetch CSS", cssUrl)
      return arrayBufferPromise(cssUrl)
    })
  })
    
  const family = fontFamily(url)
  // console.log("fontPromise", url)
  const facePromise = bufferPromise.then(buffer => {
    // console.log("fontPromise.bufferPromise", url)
    const face = new FontFace(family, buffer)
    return face.load()
  })
  return facePromise.then(face => {
    // console.log("fontPromise.facePromise", url)
    const { fonts } = globalThis.document
    fonts.add(face)
    return fonts.ready.then(() => {
      
      // console.log("fontPromise.ready", url)
      // this.updateLoaderFile(file, info)
      return { data: face }
    })
  })
}

const audioPromise =  (request: Request): Promise<AudioDataOrError> => {
  const { endpoint, init } = request
  assertEndpoint(endpoint)

  const url = endpointUrl(endpoint)
  // console.log(this.constructor.name, "audioPromise", isBlob ? 'BLOB' : url)
  return arrayBufferPromise(url, init).then(audioBufferPromise)
}

const promise: ProtocolPromise = ((request: Request, type?: LoadType) => {
  const { endpoint, init } = request
  assertEndpoint(endpoint)

  const absolute = endpointAbsolute(endpoint)
  const absoluteRequest = { init, endpoint: absolute }
  // console.log('http promise', endpoint, absolute)
  switch (type) {
    case ImageType: return imageDataPromise(absoluteRequest)
    case AudioType: return audioPromise(absoluteRequest)
    case VideoType: return videoDataPromise(absoluteRequest)
    case FontType: return fontPromise(absoluteRequest)
    case RecordType: return jsonPromise(absoluteRequest) 
    case RecordsType: return jsonPromise(absoluteRequest)
  }
  errorThrow(type, 'LoadType', 'type')
}) 

Plugins[ProtocolType][HttpProtocol] = { promise, type: HttpProtocol }
Plugins[ProtocolType][HttpsProtocol] = { promise, type: HttpsProtocol }
