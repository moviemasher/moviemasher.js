import {isRequestable} from '../../../Base/Requestable/RequestableFunctions.js'
import {isMediaType} from '../../../Setup/MediaType.js'
import {Transcoding} from './Transcoding.js'

export const isTranscoding = (value: any): value is Transcoding => {
  return isRequestable(value) && 'type' in value && isMediaType(value.type)
}