import { Request } from "../Helpers/Request/Request"
import { ClientAudio, ClientVideo, ClientMedia, ClientFont } from "../ClientMedia/ClientMedia"
import { isClientAudio, isClientFont, isClientImage, isClientVideo } from "../ClientMedia/ClientMediaFunctions"
import { LoadedInfo } from "../Plugin/Decode/Probe/Probe"
import { MediaObject, MediaObjectOrError } from "../Media/Media"
import { DecodingObject, DecodingObjects } from "../Plugin/Decode/Decoding/Decoding"
import { AudioType, ImageType, isRawType, VideoType } from "../Setup/Enums"
import { endpointFromUrl } from "../Helpers/Endpoint/EndpointFunctions"
import { idTemporary } from "./Id"
import { isAboveZero } from "./Is"
import { requestMediaPromise } from "./Request"
import { Size, sizeAboveZero, sizeCopy, sizeString } from "./Size"
import { ErrorName } from "../Helpers/Error/ErrorName"
import { errorPromise } from "../Helpers/Error/ErrorFunctions"
import { mediaTypeFromMime } from "../Media/MediaFunctions"
import { ProbeType } from "../Plugin/Decode/Decoder"


const audioInfo = (buffer: ClientAudio): LoadedInfo => {
  const { duration } = buffer
  const info: LoadedInfo = { duration, audible: true }
  return info
}

const imageInfo = (size: Size): LoadedInfo => {
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
  const info: LoadedInfo = { width, height, duration, audible }
  return info
}

function fontInfo(media: ClientFont): LoadedInfo {
  return {}
}

export const mediaInfo = (media?: ClientMedia): LoadedInfo => {
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
    const url = URL.createObjectURL(file)
    const decodings: DecodingObjects = []
    const request: Request = {
      endpoint: endpointFromUrl(url)
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
    const promise: Promise<MediaObjectOrError> = requestMediaPromise(request, type).then(orError => {
      console.log('filePromises', request, type, orError)
      if (orError.error) return orError
    
      const { clientMedia: media } = orError
      const info = mediaInfo(media)
      const decoding: DecodingObject = { info, type: ProbeType }
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
        object.clientMedia = media
       
      } else object.clientMedia = media
      
      // loadLocalFile(media, idKey, info)
      console.log('filePromises', object)
      return { mediaObject: object}
    })
    return promise
  })
}

