import { 
  RequestObject, DefinitionType, ProtocolPromise, Protocols, 
  Errors, LoadedFont, assertTrue, LoadType, isPopulatedString, 
  LoadedInfo, endpointAbsolute, LoadedAudio, assertPopulatedString,
  ContentTypeCss, RequestInitObject, urlFromCss, endpointUrl
} from "@moviemasher/moviemasher.js"
import { audioBufferPromise } from "../Utility/Audio"
import { imagePromise } from "../Utility/Image"
import { videoPromise } from "../Utility/Video"

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
    if (!isPopulatedString(type) || type.startsWith(LoadType.Font)) {
      return response.arrayBuffer()
    }
    assertTrue(type.startsWith(ContentTypeCss)) 
    
    return response.text().then(string => {
      // TODO: use resolverPromise instead
      // return resolverPromise(string, type, DefinitionType.Font)
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

const promise = ((request: RequestObject, type?: DefinitionType) => {
  const { endpoint, init } = request
  const absolute = endpointAbsolute(endpoint)
  const absoluteRequest = { init, endpoint: absolute }
  console.log('http promise', endpoint, absolute)
  switch (type) {
    case DefinitionType.Image: return imagePromise(absoluteRequest)
    case DefinitionType.Audio: return audioPromise(absoluteRequest)
    case DefinitionType.Video: return videoPromise(absoluteRequest)
    case DefinitionType.Font: return fontPromise(absoluteRequest)
  }
  console.trace('promise unsupported type', type)
  throw new Error(Errors.unimplemented + type)
}) as ProtocolPromise

Protocols.http = { promise }
Protocols.https = { promise }
