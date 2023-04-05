import type { AudioMedia, AudioMediaObject, Audio, AudioObject } from './Audio.js'
import { AudioMediaClass } from './AudioMediaClass.js'
import { MediaFactories } from '../MediaFactories.js'
import { TypeAudio } from '../../Setup/Enums.js'
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { ErrorName } from '../../Helpers/Error/ErrorName.js'


export const audioDefinition = (object : AudioMediaObject) : AudioMedia => {
  const { id } = object
  if (!id) return errorThrow(ErrorName.MediaId)

  return new AudioMediaClass(object)
}

export const audioDefinitionFromId = (id : string) : AudioMedia => {
  return audioDefinition({ id })
}

export const audioInstance = (object : AudioObject) : Audio => {
  const { mediaId: id, definition: defined } = object
  const definition = defined || audioDefinitionFromId(id!)
  const instance = definition.instanceFromObject(object)
  return instance
}

export const audioFromId = (id : string) : Audio => {
  return audioInstance({ id })
}

MediaFactories[TypeAudio] = audioDefinition