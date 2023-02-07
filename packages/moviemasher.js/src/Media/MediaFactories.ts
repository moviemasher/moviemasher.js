import { DefinitionType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { Media, MediaFactoryMethod, MediaObject } from "./Media"

const MediaFactoriesUnimplemented = (_: MediaObject): Media => {
  throw new Error(Errors.unimplemented)
}

export const MediaFactories: Record<DefinitionType, MediaFactoryMethod> = {
  [DefinitionType.Audio]: MediaFactoriesUnimplemented,
  [DefinitionType.Effect]: MediaFactoriesUnimplemented,
  [DefinitionType.Font]: MediaFactoriesUnimplemented,
  [DefinitionType.Image]: MediaFactoriesUnimplemented,
  [DefinitionType.Mash]: MediaFactoriesUnimplemented,
  [DefinitionType.Sequence]: MediaFactoriesUnimplemented,
  [DefinitionType.Video]: MediaFactoriesUnimplemented,
}