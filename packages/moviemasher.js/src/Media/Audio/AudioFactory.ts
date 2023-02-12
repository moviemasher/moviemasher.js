import { AudioDefinitionClass } from "./AudioDefinitionClass"
import { AudioDefinition, AudioDefinitionObject, Audio, AudioObject } from "./Audio"
import { MediaFactories } from "../MediaFactories"
import { AudioType } from "../../Setup/Enums"
import { errorThrow } from "../../Helpers/Error/ErrorFunctions"
import { ErrorName } from "../../Helpers/Error/ErrorName"


export const audioDefinition = (object : AudioDefinitionObject) : AudioDefinition => {
  const { id } = object
  if (!id) return errorThrow(ErrorName.MediaId)

  return new AudioDefinitionClass(object)
}

export const audioDefinitionFromId = (id : string) : AudioDefinition => {
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

MediaFactories[AudioType] = audioDefinition