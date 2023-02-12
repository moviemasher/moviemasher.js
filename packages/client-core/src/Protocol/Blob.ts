import { 
  assertPopulatedString, endpointAbsolute, LoadedAudio, 
  ProtocolPromise, 
  ClientImageOrError, ClientVideoOrError,
  Plugins, RequestObject, endpointUrl, AudioType, ImageType, VideoType, ProtocolBlob, errorThrow, assertLoadType, JsonType, FontType, requestFontPromise, LoadType, LoadedImage, LoadedFont, LoadedVideo, UnknownRecord, PathOrError, PotentialError, ClientAudioOrError
} from "@moviemasher/moviemasher.js"
import { audioBufferPromise, clientAudioPromise } from "../Utility/Audio"
import { clientImagePromise } from "../Utility/Image"
import { jsonPromise } from "../Utility/Json"
import {  clientVideoPromise } from "../Utility/Video"

const blobAudioPromise = (url: string): Promise<ArrayBuffer> => {
  // console.log(this.constructor.name, "blobAudioPromise", url)

  return fetch(url).then(response => response.blob()).then(blob => {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => { resolve(reader.result as ArrayBuffer) }
      reader.onerror = reject
      reader.readAsArrayBuffer(blob)
    }) 
  })
}


export type Mp4Extension = 'mp4'
export const Mp4Extension: Mp4Extension = 'mp4'
export type PngExtension = 'png'
export const PngExtension: PngExtension = 'png'

export type Extension = string | Mp4Extension | PngExtension




const promise: ProtocolPromise = ((request: RequestObject, type?: string) => {
  // console.log('blob promise', url, absolute, endpoint)
  switch (type) {
    case AudioType: return clientAudioPromise(request)
    case ImageType: return clientImagePromise(request)
    case VideoType: return clientVideoPromise(request)
    case JsonType: return jsonPromise(request)
    // case FontType: return requestFontPromise(request)
    // case FontType: return errorThrow(type, 'LoadType', 'type')//fontPromise(url)
    default: {
      const result: PathOrError = { path: ''}
  return Promise.resolve(result)
    }
  }
  
  console.log()
  // return errorThrow(type, 'LoadType', 'type')
}) //as ProtocolPromise



Plugins.protocols.blob = { promise, type: ProtocolBlob }

