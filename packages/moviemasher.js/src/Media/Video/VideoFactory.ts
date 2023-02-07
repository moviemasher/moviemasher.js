import { assertPopulatedString } from "../../Utility/Is"
import { VideoDefinitionClass } from "./VideoDefinitionClass"
import { Video, VideoDefinition, VideoDefinitionObject, VideoObject } from "./Video"
import { MediaFactories } from "../MediaFactories"
import { DefinitionType } from "../../Setup/Enums"

export const videoDefinition = (object : VideoDefinitionObject) : VideoDefinition => {
  const { id } = object
  assertPopulatedString(id)
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

MediaFactories[DefinitionType.Video] = videoDefinition
