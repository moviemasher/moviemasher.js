import { Definition, DefinitionObject } from "../Definition/Definition"
import { DefinitionType, MediaDefinitionType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { Media, MediaFactoryMethod } from "./Media"

const MediaFactoriesUnimplemented = (_: DefinitionObject): Media => {
  throw new Error(Errors.unimplemented)
}

export const MediaFactories: Record<MediaDefinitionType, MediaFactoryMethod> = {
  [DefinitionType.Audio]: MediaFactoriesUnimplemented,
  [DefinitionType.Font]: MediaFactoriesUnimplemented,
  [DefinitionType.Image]: MediaFactoriesUnimplemented,
  [DefinitionType.Video]: MediaFactoriesUnimplemented,
  [DefinitionType.VideoSequence]: MediaFactoriesUnimplemented,
}