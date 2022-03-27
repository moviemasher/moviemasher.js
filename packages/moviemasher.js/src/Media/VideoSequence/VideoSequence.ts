import { GenericFactory } from "../../declarations"
import {
  AudibleFile, AudibleFileObject, AudibleFileDefinition, AudibleFileDefinitionObject
} from "../../Mixin/AudibleFile/AudibleFile"
import {
  Transformable, TransformableDefinitionObject, TransformableDefinition, TransformableObject
} from "../../Mixin/Transformable/Transformable"

interface VideoSequenceObject extends AudibleFileObject, TransformableObject {
  speed?: number
}

interface VideoSequence extends AudibleFile, Transformable {
  definition : VideoSequenceDefinition
  copy : VideoSequence
  speed : number
}

interface VideoSequenceDefinitionObject extends AudibleFileDefinitionObject, TransformableDefinitionObject {
  begin?: number
  fps?: number
  increment?: number
  pattern?: string
  source?: string
  padding?: number
  url?: string
}

type AudibleOmitted = AudibleFileDefinition

interface VideoSequenceDefinition extends AudibleOmitted, TransformableDefinition {
  instance : VideoSequence
  instanceFromObject(object: VideoSequenceObject): VideoSequence
}

/**
 * @category Factory
 */
interface VideoSequenceFactory extends GenericFactory<
  VideoSequence, VideoSequenceObject, VideoSequenceDefinition, VideoSequenceDefinitionObject
> {}

export {
  VideoSequence,
  VideoSequenceDefinition,
  VideoSequenceDefinitionObject,
  VideoSequenceFactory,
  VideoSequenceObject,
}
