import { 
  assertPopulatedString, DefinitionType, endpointAbsolute, Errors, LoadedAudio, 
  ProtocolPromise, Protocols, RequestObject, endpointUrl
} from "@moviemasher/moviemasher.js"
import { audioBufferPromise } from "../Utility/Audio"
import { imagePromise } from "../Utility/Image"
import { videoPromise } from "../Utility/Video"

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


const audioPromise = (url:string): Promise<LoadedAudio | any> => {
  assertPopulatedString(url, 'url')
  // console.log(this.constructor.name, "audioPromise", isBlob ? 'BLOB' : url)
  const promise = blobAudioPromise(url) 
  return promise.then(buffer => audioBufferPromise(buffer))
}


// export const imagePromise = (url: string): Promise<LoadedImage> => {
//   const image = new Image()
//   console.trace("imagePromise", url)
//   image.src = url
//   return new Promise<LoadedImage>(resolve => {
//     image.onload = () => {
//       console.log("imagePromise.onload", url)
//       resolve(image)
//     }
//     // return image.decode().then(() => {
//     //   console.log("imagePromise.decode.then", url)
//     //   return image
//     // }).catch(wtf => {
//     //   console.error(wtf)
//     //   return image
//     // });
//   })
 
// }



const promise = ((request: RequestObject, type?: DefinitionType) => {
  const { endpoint } = request
  const absolute = endpointAbsolute(endpoint)
  const url = endpointUrl(absolute)
  // console.log('blob promise', url, absolute, endpoint)
  switch (type) {
    case DefinitionType.Audio: return audioPromise(url)
    case DefinitionType.Image: return imagePromise(url)
    case DefinitionType.Video: return videoPromise(url)

    // case DefinitionType.Font: return fontPromise(url)

    // default: return Promise.resolve('')
  }
  console.trace('promise unsupported type', type)
  throw new Error(Errors.unimplemented + type)
}) as ProtocolPromise

Protocols.blob = { promise }

