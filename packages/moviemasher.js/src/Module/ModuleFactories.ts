import { Media, MediaObject } from "../Media/Media"
import { DefinitionType, ModuleDefinitionType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { ModuleFactoryMethod } from "./Module"

const ModuleFactoriesUnimplemented = (_: MediaObject): Media => {
  throw new Error(Errors.unimplemented)
}

export const ModuleFactories: Record<ModuleDefinitionType, ModuleFactoryMethod> = {
  [DefinitionType.Effect]: ModuleFactoriesUnimplemented,
  [DefinitionType.Filter]: ModuleFactoriesUnimplemented,
}