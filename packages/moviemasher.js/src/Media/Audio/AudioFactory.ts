import { Errors } from "../../Setup/Errors"
import { Definitions } from "../../Definitions/Definitions"
import { AudioDefinitionClass } from "./AudioDefinitionClass"
import { AudioDefinition, AudioDefinitionObject, Audio, AudioObject } from "./Audio"
import { Factories } from "../../Definitions/Factories"
import { Is } from "../../Utility/Is"
import { DefinitionType } from "../../Setup/Enums"

/**
 * @internal
 */
export const audioDefinition = (object : AudioDefinitionObject) : AudioDefinition => {
  const { id } = object
  if (!id) throw Errors.id

  if (Definitions.installed(id)) return <AudioDefinition> Definitions.fromId(id)

  return new AudioDefinitionClass(object)
}

/**
 * @internal
 */
export const audioDefinitionFromId = (id : string) : AudioDefinition => {
  return audioDefinition({ id })
}

/**
 * @internal
 */
export const audioInstance = (object : AudioObject) : Audio => {
  const definition = audioDefinition(object)
  const instance = definition.instanceFromObject(object)
  return instance
}

/**
 * @internal
 */
export const audioFromId = (id : string) : Audio => {
  return audioInstance({ id })
}

/**
 * @internal
 */
export const audioInitialize = () : void => {}

/**
 * @internal
 */
export const audioInstall = (object: AudioDefinitionObject): AudioDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

  Definitions.uninstall(id)
  const instance = audioDefinition(object)
  instance.retain = true
  Definitions.install(instance)
  return instance
}

export const AudioFactoryImplementation = {
  definition: audioDefinition,
  definitionFromId: audioDefinitionFromId,
  fromId: audioFromId,
  initialize: audioInitialize,
  install: audioInstall,
  instance: audioInstance,
}

Factories[DefinitionType.Audio] = AudioFactoryImplementation
