import { 
  assertPopulatedString, AudibleContextInstance, ClientAudioOrError, 
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


export const clientAudioPromise = (request: Request): Promise<ClientAudioOrError> => {
  const { endpoint } = request
  const url = endpointUrl(endpoint)

  assertPopulatedString(url, 'url')
  // console.log(this.constructor.name, "audioPromise", isBlob ? 'BLOB' : url)
  const promise = blobAudioPromise(url) 
  return promise.then(buffer => audioBufferPromise(buffer))
}



export const audioBufferPromise = (audio: ArrayBuffer): Promise<ClientAudioOrError> => {
  return AudibleContextInstance.decode(audio)
    .then(clientAudio => ({ clientAudio, clientMedia: clientAudio }))
    .catch(error => errorCaught(error))
}

