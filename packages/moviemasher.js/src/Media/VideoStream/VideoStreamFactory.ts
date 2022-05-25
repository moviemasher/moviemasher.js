import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utility/Is"
import { Factories } from "../../Definitions/Factories"
import { VideoStreamDefinitionClass } from "./VideoStreamDefinition"
import { VideoStream, VideoStreamDefinition, VideoStreamDefinitionObject, VideoStreamObject } from "./VideoStream"

export const videoStreamDefinition = (object : VideoStreamDefinitionObject) : VideoStreamDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

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

Factories[DefinitionType.VideoStream] = {
  definition: videoStreamDefinition,
  definitionFromId: videoStreamDefinitionFromId,
  fromId: videoStreamFromId,
  instance: videoStreamInstance,
}
