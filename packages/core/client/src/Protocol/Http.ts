import { assertEndpoint, ClientAudioDataOrError, AudioType, 
  endpointAbsolute, endpointUrl, errorThrow, ClientFontDataOrError, FontType, 
  HttpProtocol, HttpsProtocol, ImageType, isPopulatedString, LoadType, 
  ProtocolPromise, ProtocolType, RecordsType, RecordType, Request, RequestInit, 
  Runtime, VideoType, pluginDataOrErrorPromise, ResolveType, isDefiniteError
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
  const family = fontFamily(url)

  const bufferPromise = fetch(url, init).then(response => {
    const mimetype = response.headers.get('content-type') || ''
    // console.log("fontPromise.fetch", type)
    if (!isPopulatedString(mimetype) || mimetype.startsWith(FontType)) {
      return response.arrayBuffer().then(buffer => {
        // console.log("fontPromise.bufferPromise", url)
        const face = new FontFace(family, buffer)
        return face.load().then(data => ({ data }))
      })
    }
    //  mimetype does not match load type - see if there is resolver
    return pluginDataOrErrorPromise(mimetype, ResolveType).then(orError => {
      if (isDefiniteError(orError)) return orError
      
      const { data: resolvePlugin } = orError
      return response.text().then(string => (
        resolvePlugin.promise(string, FontType)
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
