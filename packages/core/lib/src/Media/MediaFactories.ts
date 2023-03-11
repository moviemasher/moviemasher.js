import { AudioType, EffectType, FontType, ImageType, MashType, SequenceType, VideoType } from "../Setup/Enums"
import { MediaType } from "../Setup/MediaType"

import { Media, MediaFactoryMethod, MediaObject } from "./Media"
import { errorThrow } from "../Helpers/Error/ErrorFunctions"
import { ErrorName } from "../Helpers/Error/ErrorName"
import { FilterType } from "../Plugin/Plugin"

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