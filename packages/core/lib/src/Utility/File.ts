import { Request } from "../Helpers/Request/Request"
import { ClientAudio, ClientVideo, ClientMedia, ClientFont } from "../Helpers/ClientMedia/ClientMedia"
import { assertClientMediaType, isClientAudio, isClientFont, isClientImage, isClientVideo } from "../Helpers/ClientMedia/ClientMediaFunctions"
import { ProbingData } from "../Plugin/Decode/Probe/Probing/Probing"
import { MediaObject, MediaObjectData, MediaObjectDataOrError } from "../Media/Media"
import { DecodingObject, DecodingObjects, ProbeType } from "../Plugin/Decode/Decoding/Decoding"
import { AudioType, ImageType, VideoType } from "../Setup/Enums"
import { endpointFromUrl } from "../Helpers/Endpoint/EndpointFunctions"
import { idTemporary } from "./Id"
import { isAboveZero, isDefiniteError } from "./Is"
import { Size, sizeAboveZero, sizeCopy, sizeString } from "./Size"
import { ErrorName } from "../Helpers/Error/ErrorName"
import { errorPromise } from "../Helpers/Error/ErrorFunctions"
import { assertMediaObject, mediaTypeFromMime } from "../Media/MediaFunctions"
import { isEncodingType } from "../Plugin/Encode/Encoding/Encoding"
import { JsonMimetype } from "../Setup/Constants"
import { requestClientMediaPromise } from "../Helpers/Request/RequestFunctions"


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

export const mediaInfo = (media?: ClientMedia): ProbingData => {
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
  const request: Request = {
    endpoint: endpointFromUrl(URL.createObjectURL(file))
  }
  const object: MediaObject = {
    request, decodings,
    type, label, 
    file,
    id: idTemporary()
  }
  const isAudio = type === AudioType
  const hasDuration = isAudio || type === VideoType
  const hasSize = type === ImageType || type === VideoType
  assertClientMediaType(type)
  
  const promise = requestClientMediaPromise(request, type).then(orError => {
    if (isDefiniteError(orError)) return orError
  
    const { data: clientMedia } = orError
    
    const info = mediaInfo(clientMedia)
    const decoding: DecodingObject = { data: info, type: ProbeType }
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
      object.clientMedia = clientMedia
    } else object.clientMedia = clientMedia
    
    const mediaObjectData: MediaObjectData = { data: object }
    return mediaObjectData
  })
  return promise
}

