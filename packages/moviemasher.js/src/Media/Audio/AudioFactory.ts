import { Errors } from "../../Setup/Errors"
import { AudioDefinitionClass } from "./AudioDefinitionClass"
import { AudioDefinition, AudioDefinitionObject, Audio, AudioObject } from "./Audio"
import { MediaFactories } from "../MediaFactories"
import { DefinitionType } from "../../Setup/Enums"


export const audioDefinition = (object : AudioDefinitionObject) : AudioDefinition => {
  const { id } = object
  if (!id) throw Errors.id

  return new AudioDefinitionClass(object)
}

export const audioDefinitionFromId = (id : string) : AudioDefinition => {
  return audioDefinition({ id })
}

export const audioInstance = (object : AudioObject) : Audio => {
  const definition = audioDefinition(object)
  const instance = definition.instanceFromObject(object)
  return instance
}

export const audioFromId = (id : string) : Audio => {
  return audioInstance({ id })
}

MediaFactories[DefinitionType.Audio] = audioDefinition