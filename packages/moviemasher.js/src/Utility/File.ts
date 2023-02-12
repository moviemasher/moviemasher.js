import { RequestObject } from "../Api/Api"
import { LoadedAudio, LoadedVideo, LoadedMedia, LoadedFont } from "../Load/Loaded"
import { isLoadedAudio, isLoadedFont, isLoadedImage, isLoadedVideo, LoadedInfo } from "../Load/Loader"
import { MediaObject, MediaObjectOrError } from "../Media/Media"
import { DecodingObject, DecodingObjects } from "../Decode/Decoding/Decoding"
import { assertLoadType, AudioType, FontType, ImageType, isRawType, LoadType, VideoType } from "../Setup/Enums"
import { endpointFromUrl } from "../Helpers/Endpoint/EndpointFunctions"
import { idGenerateString, idTemporary } from "./Id"
import { isAboveZero } from "./Is"
import { requestAudioPromise, requestFontPromise, requestImagePromise, requestMediaPromise, requestVideoPromise } from "./Request"
import { Size, sizeAboveZero, sizeCopy, sizeString } from "./Size"
import { ErrorName } from "../Helpers/Error/ErrorName"
import { errorPromise, errorThrow } from "../Helpers/Error/ErrorFunctions"
import { mediaTypeFromMime } from "../Media/MediaFunctions"


const audioInfo = (buffer: LoadedAudio): LoadedInfo => {
  const { duration } = buffer
  const info: LoadedInfo = { duration, audible: true }
  return info
}

const imageInfo = (size: Size): LoadedInfo => {
  return sizeCopy(size)
}

const videoInfo = (video: LoadedVideo) => {
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

function fontInfo(media: LoadedFont): LoadedInfo {
  return {}
}

export const mediaInfo = (media?: LoadedMedia): LoadedInfo => {
  if (isLoadedVideo(media)) return videoInfo(media)
  if (isLoadedImage(media)) return imageInfo(media)
  if (isLoadedFont(media)) return fontInfo(media)
  if (isLoadedAudio(media)) return audioInfo(media)
  return {}
}

export const filePromises = (files: File[], size?: Size): Promise<MediaObjectOrError>[] => {
  return files.map(file => {
    const { name: label, type: fileType } = file
    const type = mediaTypeFromMime(fileType)

    if (!isRawType(type)) {
      return errorPromise(ErrorName.ImportType, { value: type })
    }
    const url = URL.createObjectURL(file)
    const decodings: DecodingObjects = []
    const request: RequestObject = {
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
      if (orError.error) return orError
    
      const { clientMedia: media } = orError
      const info = mediaInfo(media)
      const decoding: DecodingObject = { info }
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
        object.loadedMedia = media
       
      } else object.loadedMedia = media
      
      // loadLocalFile(media, idKey, info)
      console.log('filePromises', object)
      return { mediaObject: object}
    })
    return promise
  })
}

