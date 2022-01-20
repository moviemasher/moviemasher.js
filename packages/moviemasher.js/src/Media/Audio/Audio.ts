import { GenericFactory } from "../../declarations"
import {
  AudibleFile,
  AudibleFileObject,
  AudibleFileDefinition,
  AudibleFileDefinitionObject
} from "../../Mixin/AudibleFile/AudibleFile"

type AudioObject = AudibleFileObject

interface Audio extends AudibleFile {
  definition : AudioDefinition
}

type AudioDefinitionObject = AudibleFileDefinitionObject

interface AudioDefinition extends AudibleFileDefinition {
  instance: Audio
  instanceFromObject(object: AudioObject): Audio
}

/**
 * @category Factory
 */
interface AudioFactory extends GenericFactory<
  Audio, AudioObject, AudioDefinition, AudioDefinitionObject
> { }

export { Audio, AudioObject, AudioDefinition, AudioDefinitionObject, AudioFactory }
