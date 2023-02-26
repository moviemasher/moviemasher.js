import { 
  assertEndpoint,
  assertPopulatedString, AudibleContextInstance, AudioDataOrError, 
  endpointUrl, errorCaught, Request
} from "@moviemasher/moviemasher.js"

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

export const audioDataPromise = (request: Request): Promise<AudioDataOrError> => {
  const { endpoint } = request
  assertEndpoint(endpoint)

  const url = endpointUrl(endpoint)
  assertPopulatedString(url, 'url')
  // console.log(this.constructor.name, "audioPromise", isBlob ? 'BLOB' : url)
  const promise = blobAudioPromise(url) 
  return promise.then(audioBufferPromise)
}

export const audioBufferPromise = (audio: ArrayBuffer): Promise<AudioDataOrError> => {
  return AudibleContextInstance.decode(audio).then(data => ({ data }))
    .catch(error => errorCaught(error))
}

