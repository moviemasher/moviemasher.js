import { assertPopulatedString } from "../../Utility/Is"
import { VideoMediaClass } from "./VideoMediaClass"
import { Video, VideoMedia, VideoMediaObject, VideoObject } from "./Video"
import { MediaFactories } from "../MediaFactories"
import { VideoType } from "../../Setup/Enums"
import { MediaType } from "../../Setup/MediaType"

export const videoDefinition = (object : VideoMediaObject) : VideoMedia => {
  const { id } = object
  assertPopulatedString(id)
  return new VideoMediaClass(object)
}

export const videoDefinitionFromId = (id : string) : VideoMedia => {
  return videoDefinition({ id })
}

export const videoInstance = (object : VideoObject) : Video => {
  const { mediaId: id, definition: defined } = object
  const definition = defined || videoDefinitionFromId(id!)
  const instance = definition.instanceFromObject(object)
  return instance
  
}

export const videoFromId = (id : string) : Video => {
  return videoInstance({ id })
}

MediaFactories[VideoType] = videoDefinition
