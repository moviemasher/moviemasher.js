import { RequestObject } from "../Api/Api"
import { LoadedAudio, LoadedImage, LoadedVideo, LoadedMedia, LoadedFont } from "../declarations"
import { ErrorObject, isLoadedFont, isLoadedImage, isLoadedVideo, LoadedInfo } from "../Loader/Loader"
import { MediaObject, MediaOrErrorObject } from "../Media/Media"
import { ProbingObject, ProbingObjects } from "../Media/Probing/Probing"
import { assertLoadType, isUploadType, LoadType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { endpointFromUrl } from "./Endpoint"
import { idGenerateString, idTemporary } from "./Id"
import { isAboveZero } from "./Is"
import { requestAudioPromise, requestFontPromise, requestImagePromise, requestVideoPromise } from "./Request"
import { Size, sizeAboveZero, sizeCopy, sizeString } from "./Size"
import { urlPrependProtocol } from "./Url"


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
// export const loadLocalFile = (media: LoadedMedia, cacheKey: LoaderPath, loadedInfo: LoadedInfo): void => {
//   const cache: LoaderCache = {
//     definitions: [], result: media, loadedInfo,
//     promise: Promise.resolve(media), loaded: true, 
//   }
//   setLoaderCache(cacheKey, cache)
// }

export const mediaInfo = (media: LoadedMedia): LoadedInfo => {
  if (isLoadedVideo(media)) return videoInfo(media)
  if (isLoadedImage(media)) return imageInfo(media)
  if (isLoadedFont(media)) return fontInfo(media)
  return audioInfo(media)
}

export const mediaPromise = (type: LoadType, request: RequestObject): Promise<LoadedMedia> => {
  assertLoadType(type)
  switch(type) {
    case LoadType.Audio: return requestAudioPromise(request)
    case LoadType.Image: return requestImagePromise(request)
    case LoadType.Video: return requestVideoPromise(request)
    case LoadType.Font: return requestFontPromise(request)
  }
  throw new Error(Errors.internal)
}



export const filePromises = (files: File[], size?: Size): Promise<MediaOrErrorObject>[] => {
  return files.map(file => {
    const { name: label, type: fileType } = file
    const type = fileType.split('/').shift()
    const error: ErrorObject = { label, error: '' }
    if (!isUploadType(type)) {
      return Promise.resolve({ ...error, error: 'import.type', value: type })
    }
    
    const id = idGenerateString()
    const idKey = urlPrependProtocol('object', id)
    const url = URL.createObjectURL(file)
    const probings: ProbingObjects = []
    const request: RequestObject = {
      endpoint: endpointFromUrl(url)
    }
    const object: MediaObject = {
      request, probings,
      type, label, 
      //url: urlPrependProtocol(type, idKey), source: url, 
      id: idTemporary()
    }
    const isAudio = type === LoadType.Audio
    const isImage = type === LoadType.Image
    const hasDuration = isAudio || type === LoadType.Video
    const hasSize = type === LoadType.Image || type === LoadType.Video
    const promise = mediaPromise(type, request)
    return promise.then(media => {
      const info = mediaInfo(media)
      const probing: ProbingObject = { info, id: idGenerateString() }
      probings.push(probing)
      if (hasDuration) {
        const { duration } = info
        if (!isAboveZero(duration)) return { 
          ...error, error: 'import.duration', value: duration
        }
        // we can't reliably tell if there is an audio track...
        // so we assume there is one, and catch problems when it's played 
        info.audible = true
        // object.duration = duration
        // object.audioUrl = hasSize ? urlPrependProtocol('video', idKey) : idKey
      }
      if (hasSize) {
        const inSize = sizeCopy(info)
        if (!sizeAboveZero(inSize)) return { 
          ...error, error: 'import.size', value: sizeString(inSize)
        }
        // const previewSize = size ? sizeCover(inSize, size, true) : inSize
        // const { width, height } = previewSize
        // object.previewSize = previewSize

        if (isImage) {
          // object.icon = urlPrependProtocol('image', idKey, { width, height })
          object.loadedMedia = media
        } else {
          // object.icon = urlPrependProtocol('video', idKey, { fps: 10, frame: 10 })
          object.loadedMedia = media
        }
      } else object.loadedMedia = media
      
      // loadLocalFile(media, idKey, info)
      console.log('filePromises', object)
      return object
    })
  })
}

function fontInfo(media: LoadedFont): LoadedInfo {
  throw new Error("Function not implemented.")
}
