import { GenericFactory } from "../../declarations"
import {
  AudibleFile,
  AudibleFileObject,
  AudibleFileDefinition,
  AudibleFileDefinitionObject
} from "../../Mixin/AudibleFile/AudibleFile"

export type AudioObject = AudibleFileObject

export interface Audio extends AudibleFile {
  definition : AudioDefinition
}

export type AudioDefinitionObject = AudibleFileDefinitionObject

export interface AudioDefinition extends AudibleFileDefinition {
  instance: Audio
  instanceFromObject(object: AudioObject): Audio
}

/**
 * @category Factory
 */
export interface AudioFactory extends GenericFactory<
  Audio, AudioObject, AudioDefinition, AudioDefinitionObject
> { }
