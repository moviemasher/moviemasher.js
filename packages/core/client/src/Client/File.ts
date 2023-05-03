import type {
  EndpointRequest, ClientAudio, ClientFont, ClientMedia, ClientVideo, DecodingObject, 
  DecodingObjects, MediaObject, MediaObjectData, MediaObjectDataOrError, 
  ProbingData, Size, 
} from '@moviemasher/lib-core'
import { 
  assertClientMediaType, assertMediaObject, TypeAudio, endpointFromUrl, 
  ErrorName, errorPromise, idTemporary, TypeImage, isAboveZero, isClientAudio, 
  isClientFont, isClientImage, isClientVideo, isDefiniteError, isEncodingType,
  JsonMimetype, mediaTypeFromMime, requestClientMediaPromise, sizeAboveZero, 
  sizeCopy, sizeString, TypeProbe, TypeVideo 
} from "@moviemasher/lib-core"

const audioInfo = (buffer: ClientAudio): ProbingData => {
  const { duration } = buffer
  const info: ProbingData = { duration, audible: true }
  return info
}

const imageInfo = (size: Size): ProbingData => {
  return sizeCopy(size)
}

const videoInfo = (video: ClientVideo) => {
  const { 
    duration, videoWidth, clientWidth, videoHeight, clientHeight 
  } = video
  const width = videoWidth || clientWidth
  const height = videoHeight || clientHeight
  
  const object = video as any
  let audible = object.mozHasAudio
  audible ||= Boolean(object.webkitAudioDecodedByteCount)
  audible ||= Boolean(object.audioTracks?.length)
  if (!audible) console.log(Object.values(video))
  const info: ProbingData = { width, height, duration, audible }
  return info
}

function fontInfo(media: ClientFont): ProbingData {
  return {}
}

const mediaInfo = (media?: ClientMedia): ProbingData => {
  if (isClientVideo(media)) return videoInfo(media)
  if (isClientImage(media)) return imageInfo(media)
  if (isClientFont(media)) return fontInfo(media)
  if (isClientAudio(media)) return audioInfo(media)
  return {}
}

export const fileMediaObjectPromise = (file: File): Promise<MediaObjectDataOrError> => {
  const { name: label, type: mimetype } = file

  if (mimetype === JsonMimetype) {
    return file.text().then(text => {
      const data = JSON.parse(text)
      assertMediaObject(data)
      
      return { data }
    })
  }

  const type = mediaTypeFromMime(mimetype)

  if (!isEncodingType(type)) {
    console.log('fileMediaObjectPromise NOT raw type', type, mimetype, file)
    return errorPromise(ErrorName.ImportType, { value: type || '' })
  }
  
  const decodings: DecodingObjects = []
  const request: EndpointRequest = {
    endpoint: endpointFromUrl(URL.createObjectURL(file))
  }
  const object: MediaObject = {
    request, decodings,
    type, label, 
    file,
    id: idTemporary()
  }
  const isAudio = type === TypeAudio
  const hasDuration = isAudio || type === TypeVideo
  const hasSize = type === TypeImage || type === TypeVideo
  assertClientMediaType(type)
  
  const promise = requestClientMediaPromise(request, type).then(orError => {
    if (isDefiniteError(orError)) return orError
  
    const { data } = orError
    
    const info = mediaInfo(data)
    const decoding: DecodingObject = { data: info, type: TypeProbe }
    decodings.push(decoding)
    if (hasDuration) {
      const { duration = 0 } = info
      if (!isAboveZero(duration)) {
        return errorPromise(ErrorName.ImportDuration, { value: duration })
      }
      // we can't reliably tell if there is an audio track...
      // so we assume there is one, and catch problems if it's played 
      // before decoded
      info.audible = true
    }
    if (hasSize) {
      const inSize = sizeCopy(info)
      if (!sizeAboveZero(inSize)) {
        return errorPromise(ErrorName.ImportSize, { value: sizeString(inSize) })
      }
    } 
    const mediaObjectData: MediaObjectData = { data: object }
    return mediaObjectData
  })
  return promise
}

