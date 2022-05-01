import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utility/Is"
import { Definitions } from "../../Definitions"
import { Factories } from "../../Definitions/Factories"
import { VideoDefinitionClass } from "./VideoDefinitionClass"
import { Video, VideoDefinition, VideoDefinitionObject, VideoObject } from "./Video"

export const videoDefinition = (object : VideoDefinitionObject) : VideoDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  if (Definitions.installed(id)) return <VideoDefinition> Definitions.fromId(id)

  return new VideoDefinitionClass(object)
}

export const videoDefinitionFromId = (id : string) : VideoDefinition => {
  return videoDefinition({ id })
}

export const videoInstance = (object : VideoObject) : Video => {
  const definition = videoDefinition(object)
  const instance = definition.instanceFromObject(object)
  return instance
}

export const videoFromId = (id : string) : Video => {
  return videoInstance({ id })
}

export const videoInitialize = () : void => {}

export const videoInstall = (object : VideoDefinitionObject) : VideoDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  Definitions.uninstall(id)
  const instance = videoDefinition(object)
  instance.retain = true
  Definitions.install(instance)
  return instance
}


export const VideoFactoryImplementation = {
  install: videoInstall,
  definition: videoDefinition,
  definitionFromId: videoDefinitionFromId,
  fromId: videoFromId,
  initialize: videoInitialize,
  instance: videoInstance,
}

Factories[DefinitionType.Video] = VideoFactoryImplementation
