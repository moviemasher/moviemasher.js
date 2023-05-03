import type {Video, VideoMedia, VideoMediaObject, VideoObject} from './Video.js'

import {assertPopulatedString} from '../../Utility/Is.js'
import {VideoMediaClass} from './VideoMediaClass.js'
import {MediaFactories} from '../MediaFactories.js'
import {TypeVideo} from '../../Setup/Enums.js'

export const videoDefinition = (object : VideoMediaObject,) : VideoMedia => {
  const { id } = object
  assertPopulatedString(id)
  return new VideoMediaClass(object)
}

export const videoDefinitionFromId = (id : string) : VideoMedia => {
  return videoDefinition({ id })
}

export const videoInstance = (object : VideoObject) : Video => {
  const { mediaId: id, definition: defined } = object
  const definition = defined || videoDefinitionFromId(id!)
  const instance = definition.instanceFromObject(object)
  return instance
  
}

export const videoFromId = (id : string) : Video => {
  return videoInstance({ id })
}

MediaFactories[TypeVideo] = videoDefinition
