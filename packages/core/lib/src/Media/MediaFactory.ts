import { assertMediaType } from "../Setup/MediaType"
import { Media, MediaObject } from "./Media"
import { MediaFactories } from "./MediaFactories"


export const mediaDefinition = (object: MediaObject): Media => {
  const { type } = object
  assertMediaType(type)

  return MediaFactories[type](object)
}