import { AudioType, EffectType, FontType, ImageType, MashType, MediaType, SequenceType, VideoType } from "../Setup/Enums"

import { Media, MediaFactoryMethod, MediaObject } from "./Media"
import { errorThrow } from "../Helpers/Error/ErrorFunctions"
import { ErrorName } from "../Helpers/Error/ErrorName"

const MediaFactoriesUnimplemented = (_: MediaObject): Media => {
  return errorThrow(ErrorName.Unimplemented)
}

export const MediaFactories: Record<MediaType, MediaFactoryMethod> = {
  [AudioType]: MediaFactoriesUnimplemented,
  [EffectType]: MediaFactoriesUnimplemented,
  [FontType]: MediaFactoriesUnimplemented,
  [ImageType]: MediaFactoriesUnimplemented,
  [MashType]: MediaFactoriesUnimplemented,
  [SequenceType]: MediaFactoriesUnimplemented,
  [VideoType]: MediaFactoriesUnimplemented,
}