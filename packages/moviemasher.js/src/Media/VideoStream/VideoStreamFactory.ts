import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utility/Is"
import { Definitions } from "../../Definitions"
import { Factories } from "../../Definitions/Factories"
import { VideoStreamDefinitionClass } from "./VideoStreamDefinition"
import { VideoStream, VideoStreamDefinition, VideoStreamDefinitionObject, VideoStreamObject } from "./VideoStream"

export const videoStreamDefinition = (object : VideoStreamDefinitionObject) : VideoStreamDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  if (Definitions.installed(id)) return <VideoStreamDefinition> Definitions.fromId(id)

  return new VideoStreamDefinitionClass(object)
}

export const videoStreamDefinitionFromId = (id : string) : VideoStreamDefinition => {
  return videoStreamDefinition({ id })
}

export const videoStreamInstance = (object : VideoStreamObject) : VideoStream => {
  const definition = videoStreamDefinition(object)
  const instance = definition.instanceFromObject(object)
  return instance
}

export const videoStreamFromId = (id : string) : VideoStream => {
  return videoStreamInstance({ id })
}

export const videoStreamInitialize = (): void => {}

export const videoStreamInstall = (object : VideoStreamDefinitionObject) : VideoStreamDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  Definitions.uninstall(id)
  const instance = videoStreamDefinition(object)
  instance.retain = true
  Definitions.install(instance)
  return instance
}

export const VideoStreamFactoryImplementation = {
  install: videoStreamInstall,
  definition: videoStreamDefinition,
  definitionFromId: videoStreamDefinitionFromId,
  fromId: videoStreamFromId,
  initialize: videoStreamInitialize,
  instance: videoStreamInstance,
}

Factories[DefinitionType.VideoStream] = VideoStreamFactoryImplementation
