import { GenericFactory } from "../../declarations"
import {
  AudibleFile, AudibleFileObject, AudibleFileDefinition, AudibleFileDefinitionObject
} from "../../Mixin/AudibleFile/AudibleFile"
import {
  Transformable, TransformableDefinitionObject, TransformableDefinition, TransformableObject
} from "../../Mixin/Transformable/Transformable"

export interface VideoSequenceObject extends AudibleFileObject, TransformableObject {
  speed?: number
}

export interface VideoSequence extends AudibleFile, Transformable {
  definition : VideoSequenceDefinition
  copy : VideoSequence
  speed : number
}

export interface VideoSequenceDefinitionObject extends AudibleFileDefinitionObject, TransformableDefinitionObject {
  begin?: number
  fps?: number
  increment?: number
  pattern?: string
  source?: string
  padding?: number
  url?: string
}

export type AudibleOmitted = AudibleFileDefinition

export interface VideoSequenceDefinition extends AudibleOmitted, TransformableDefinition {
  instance : VideoSequence
  instanceFromObject(object: VideoSequenceObject): VideoSequence
}

/**
 * @category Factory
 */
export interface VideoSequenceFactory extends GenericFactory<
  VideoSequence, VideoSequenceObject, VideoSequenceDefinition, VideoSequenceDefinitionObject
> {}
