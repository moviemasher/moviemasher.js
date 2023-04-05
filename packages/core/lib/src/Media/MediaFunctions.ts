import { isRequestableObject } from '../Base/Requestable/RequestableFunctions.js'
import { ClientMediaType } from '../Helpers/ClientMedia/ClientMedia.js'
import { isClientMediaType } from '../Helpers/ClientMedia/ClientMediaFunctions.js'
import { errorThrow } from '../Helpers/Error/ErrorFunctions.js'
import { isTranscoding } from '../Plugin/Transcode/Transcoding/TranscodingFunctions.js'
import { SlashChar } from '../Setup/Constants.js'
import { isMediaType } from '../Setup/MediaType.js'
import { isObject } from '../Utility/Is.js'
import { Media, MediaInstance, MediaInstanceObject, MediaObject } from './Media.js'

export const mediaTypeFromMime = (mime?: string): ClientMediaType | undefined => {
  if (!mime) return 

  const [first] = mime.split(SlashChar)
  if (isClientMediaType(first)) return first
}


export const isMediaInstance = (value?: any): value is MediaInstance => {
  return isObject(value) && 'definitionIds' in value
}

export const isMedia = (value: any): value is Media => {
  return isTranscoding(value) && 'type' in value && isMediaType(value.type)
}

export function assertMedia(value: any, name?: string): asserts value is Media {
  if (!isMedia(value)) errorThrow(value, 'Media', name)
}


export const isMediaObject = (value: any): value is MediaObject => {
  return isRequestableObject(value) 
}

export function assertMediaObject(value: any, name?: string): asserts value is MediaObject {
  if (!isMediaObject(value)) errorThrow(value, 'MediaObject', name)
}

export const isMediaInstanceObject = (value?: any): value is MediaInstanceObject => {
  return isObject(value) && ('mediaId' in value || 'definition' in value)
}
