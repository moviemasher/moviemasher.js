import type { Media, MediaObject } from './Media.js'

import { assertMediaType } from '../Setup/MediaType.js'
import { MediaFactories } from './MediaFactories.js'


export const mediaDefinition = (object: MediaObject): Media => {
  const { type } = object
  assertMediaType(type)

  return MediaFactories[type](object)
}