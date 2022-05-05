import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utility/Is"
import { Factories } from "../../Definitions/Factories"
import { VideoDefinitionClass } from "./VideoDefinitionClass"
import { Video, VideoDefinition, VideoDefinitionObject, VideoObject } from "./Video"

export const videoDefinition = (object : VideoDefinitionObject) : VideoDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  return new VideoDefinitionClass(object)
}

export const videoDefinitionFromId = (id : string) : VideoDefinition => {
  return videoDefinition({ id })
}

export const videoInstance = (object : VideoObject) : Video => {
  const definition = videoDefinition(object)
  return definition.instanceFromObject(object)
}

export const videoFromId = (id : string) : Video => {
  return videoInstance({ id })
}

export const VideoFactoryImplementation = {
  definition: videoDefinition,
  definitionFromId: videoDefinitionFromId,
  fromId: videoFromId,
  instance: videoInstance,
}

Factories[DefinitionType.Video] = VideoFactoryImplementation
