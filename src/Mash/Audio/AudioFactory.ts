import { Errors } from "../../Setup/Errors"
import { Definitions } from "../Definitions/Definitions"
import { AudioDefinitionClass } from "./AudioDefinition"
import { AudioDefinition, AudioDefinitionObject } from "./Audio"
import { Audio, AudioObject } from "./Audio"
import { Factories } from "../Factories/Factories"
import { Is } from "../../Utilities/Is"

/**
 * @internal
 */
const audioDefinition = (object : AudioDefinitionObject) : AudioDefinition => {
  const { id } = object
  if (!id) throw Errors.id

  if (Definitions.installed(id)) return <AudioDefinition> Definitions.fromId(id)

  return new AudioDefinitionClass(object)
}

/**
 * @internal
 */
const audioDefinitionFromId = (id : string) : AudioDefinition => {
  return audioDefinition({ id })
}

/**
 * @internal
 */
const audioInstance = (object : AudioObject) : Audio => {
  const definition = audioDefinition(object)
  const instance = definition.instanceFromObject(object)
  return instance
}

/**
 * @internal
 */
const audioFromId = (id : string) : Audio => {
  return audioInstance({ id })
}

/**
 * @internal
 */
const audioInitialize = () : void => {}

/**
 * @internal
 */
const audioDefine = (object : AudioDefinitionObject) : AudioDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

  Definitions.uninstall(id)
  return audioDefinition(object)
}

const AudioFactoryImplementation = {
  define: audioDefine,
  definition: audioDefinition,
  definitionFromId: audioDefinitionFromId,
  fromId: audioFromId,
  initialize: audioInitialize,
  instance: audioInstance,
}

Factories.audio = AudioFactoryImplementation


export {
  audioDefine,
  audioDefinition,
  audioDefinitionFromId,
  AudioFactoryImplementation,
  audioFromId,
  audioInitialize,
  audioInstance,
}
