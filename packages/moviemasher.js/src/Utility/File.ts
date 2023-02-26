import { Request } from "../Helpers/Request/Request"
import { ClientAudio, ClientVideo, ClientMedia, ClientFont, MediaDataOrError } from "../ClientMedia/ClientMedia"
import { isClientAudio, isClientFont, isClientImage, isClientVideo } from "../ClientMedia/ClientMediaFunctions"
import { ProbingData } from "../Plugin/Decode/Probe/Probing/Probing"
import { MediaObject, MediaObjectOrError } from "../Media/Media"
import { DecodingObject, DecodingObjects } from "../Plugin/Decode/Decoding/Decoding"
import { AudioType, ImageType, isRawType, VideoType } from "../Setup/Enums"
import { endpointFromUrl } from "../Helpers/Endpoint/EndpointFunctions"
import { idTemporary } from "./Id"
import { isAboveZero, isDefiniteError } from "./Is"
import { requestRawPromise } from "../Helpers/Request/RequestFunctions"
import { Size, sizeAboveZero, sizeCopy, sizeString } from "./Size"
import { ErrorName } from "../Helpers/Error/ErrorName"
import { errorPromise } from "../Helpers/Error/ErrorFunctions"
import { mediaTypeFromMime } from "../Media/MediaFunctions"
import { ProbeType } from "../Plugin/Decode/Decoder"


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

export const filePromises = (files: File[], size?: Size): Promise<MediaObjectOrError>[] => {
  console.log('filePromises', files, size)

  return files.map(file => {
    const { name: label, type: fileType } = file
    const type = mediaTypeFromMime(fileType)

    if (!isRawType(type)) {
      console.log('filePromises NOT raw type', type, fileType, file)
      return errorPromise(ErrorName.ImportType, { value: type })
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
    const promise: Promise<MediaDataOrError> = requestRawPromise(request, type).then(orError => {
      console.log('filePromises', request, type, orError)
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
        // object.duration = duration
        // object.audioUrl = hasSize ? urlPrependProtocol('video', idKey) : idKey
      }
      if (hasSize) {
        const inSize = sizeCopy(info)
        if (!sizeAboveZero(inSize)) {
          return errorPromise(ErrorName.ImportSize, { value: sizeString(inSize) })
        }  
        
       
        // const previewSize = size ? sizeCover(inSize, size, true) : inSize
        // const { width, height } = previewSize
        // object.previewSize = previewSize
        object.clientMedia = clientMedia
       
      } else object.clientMedia = clientMedia
      
      // loadLocalFile(media, idKey, info)
      console.log('filePromises', object)
      return { mediaObject: object}
    })
    return promise
  })
}

