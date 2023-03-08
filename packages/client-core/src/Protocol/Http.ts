import { 
  assertEndpoint, assertTrue, ClientAudioDataOrError, AudioType, CssMimetype, 
  endpointAbsolute, endpointUrl, errorThrow, ClientFontDataOrError, FontType, 
  HttpProtocol, HttpsProtocol, ImageType, isPopulatedString, LoadType, 
  ProtocolPromise, ProtocolType, RecordsType, RecordType, Request, RequestInit, 
  Runtime, urlFromCss, VideoType 
} from "@moviemasher/moviemasher.js"
import { audioBufferPromise } from "../Utility/Audio"
import { imageDataPromise } from "../Utility/Image"
import { jsonPromise } from "../Utility/Json"
import { videoDataPromise } from "../Utility/Video"

const arrayBufferPromise = (url: string, init?: RequestInit): Promise<ArrayBuffer> => (
   fetch(url, init).then(response => response.arrayBuffer())
)

const fontFamily = (url: string): string => url.replace(/[^a-z0-9]/gi, '_')

const fontPromise =  (request: Request): Promise<ClientFontDataOrError> => {
  const { endpoint, init } = request
  assertEndpoint(endpoint)

  const url = endpointUrl(endpoint)
  
  const bufferPromise = fetch(url, init).then(response => {
    const mimetype = response.headers.get('content-type') || ''
    // console.log("fontPromise.fetch", type)
    if (!isPopulatedString(mimetype) || mimetype.startsWith(FontType)) {
      return response.arrayBuffer()
    }
    assertTrue(mimetype.startsWith(CssMimetype)) 
    
    return response.text().then(string => {
      // TODO: use resolverPromise instead
      // return resolverPromise(string, type, FontType)
      const cssUrl = urlFromCss(string)
      console.log("fontPromise.fetch CSS", cssUrl)
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

const audioPromise =  (request: Request): Promise<ClientAudioDataOrError> => {
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

Runtime.plugins[ProtocolType][HttpProtocol] ||= { promise, type: ProtocolType, protocol: HttpProtocol }
Runtime.plugins[ProtocolType][HttpsProtocol] ||= { promise, type: ProtocolType, protocol: HttpsProtocol }
