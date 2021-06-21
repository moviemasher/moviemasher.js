import { GenericFactory } from "../../Setup"
import {
  Audible,
  AudibleObject,
  AudibleDefinition,
  AudibleDefinitionObject
} from "../Mixin/Audible/Audible"

type AudioObject = AudibleObject

interface Audio extends Audible {
  definition : AudioDefinition
}

type AudioDefinitionObject = AudibleDefinitionObject

interface AudioDefinition extends AudibleDefinition {
  instance: Audio
  instanceFromObject(object: AudioObject): Audio
}

type AudioFactory = GenericFactory<Audio, AudioObject, AudioDefinition, AudioDefinitionObject>

export { Audio, AudioObject, AudioDefinition, AudioDefinitionObject, AudioFactory }
