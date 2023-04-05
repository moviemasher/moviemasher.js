import type { MediaType } from '../Setup/MediaType.js'
import type { MediaArray } from './Media.js'

import { 
  TypeAudio, TypeEffect, TypeFont, TypeImage, TypeMash, TypeVideo 
} from '../Setup/Enums.js'

export const MediaDefaults: Record<MediaType, MediaArray> = {
  [TypeAudio]: [],
  [TypeEffect]: [],
  [TypeFont]: [],
  [TypeImage]: [],
  [TypeMash]: [],
  [TypeVideo]: [],
}
