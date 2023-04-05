import type { MediaType } from '../Setup/MediaType.js'
import type { Media, MediaFactoryMethod, MediaObject } from './Media.js'

import { errorThrow } from '../Helpers/Error/ErrorFunctions.js'
import { ErrorName } from '../Helpers/Error/ErrorName.js'
import { 
  TypeAudio, TypeEffect, TypeFont, TypeImage, TypeMash, TypeVideo 
} from '../Setup/Enums.js'

const MediaFactoriesUnimplemented = (_: MediaObject): Media => {
  return errorThrow(ErrorName.Unimplemented)
}

export const MediaFactories: Record<MediaType, MediaFactoryMethod> = {
  [TypeAudio]: MediaFactoriesUnimplemented,
  [TypeEffect]: MediaFactoriesUnimplemented,
  [TypeFont]: MediaFactoriesUnimplemented,
  [TypeImage]: MediaFactoriesUnimplemented,
  [TypeMash]: MediaFactoriesUnimplemented,
  [TypeVideo]: MediaFactoriesUnimplemented,
}