
import { Definition } from "../Definition/Definition"
import { isPreloadableDefinitionObject } from "../Mixin/Preloadable/Preloadable"
import { assertMediaDefinitionType, DefinitionType } from "../Setup/Enums"
import { endpointFromUrl } from "../Utility/Endpoint"
import { idGenerate } from "../Utility/Id"
import { assertPopulatedString, assertString, isPopulatedString, isPositive } from "../Utility/Is"
import { EncodingObjects } from "../Edited/Mash/Encoding/Encoding"
import { Media, MediaObject, MediaTransitionalObject } from "./Media"
import { MediaFactories } from "./MediaFactories"
import { ProbingObjects } from "./Probing/Probing"
import { TranscodingObjects } from "./Transcoding/Transcoding"


export const mediaObject = (object: MediaTransitionalObject): MediaObject => {
  if (!isPreloadableDefinitionObject(object)) return object

  const probings: ProbingObjects = []
  const encodings: EncodingObjects = []
  const transcodings: TranscodingObjects = []

  const { id: idOrNot, source, url, type, label, mimeType, bytes, icon, ...rest } = object
  assertMediaDefinitionType(type)
  assertPopulatedString(label, 'label')
  const kind = isPopulatedString(mimeType) ? mimeType.split('/').pop() : ''
  assertString(kind, 'kind')

  // id is optional for font objects
  const id = isPopulatedString(idOrNot) ? idOrNot : 'com.moviemasher.font.default'
  const size = isPositive(bytes) ? bytes : 0

  const originalUrl = source || url
  const previewUrl = url || source
  
  assertPopulatedString(originalUrl)
  assertPopulatedString(previewUrl)


  switch(type) {
    case DefinitionType.Audio: {

      if (originalUrl != previewUrl) transcodings.push({
        id: idGenerate(), type, request: { endpoint: endpointFromUrl(previewUrl) }
      })
      break
    }
    case DefinitionType.Video: {
      transcodings.push({
        id: idGenerate(), type, request: { endpoint: endpointFromUrl(previewUrl) }
      })
      break
    }
    case DefinitionType.Image: {
      transcodings.push({
        id: idGenerate(), type, request: { endpoint: endpointFromUrl(icon || previewUrl) }
      })
      break
    }
    case DefinitionType.Font: {
      transcodings.push({
        id: idGenerate(), type, request: { endpoint: endpointFromUrl(previewUrl) }
      })
      break
    }
  }
  
  const mediaObject: MediaObject = {
    ...rest,
    id, type, probings, encodings, transcodings, label, kind, size, 
    request: { endpoint: endpointFromUrl(originalUrl) }
  }

  return mediaObject
}


export const mediaDefinition = (object: MediaTransitionalObject): Media => {
  const { type } = object
  assertMediaDefinitionType(type)

  return MediaFactories[type](mediaObject(object))
}