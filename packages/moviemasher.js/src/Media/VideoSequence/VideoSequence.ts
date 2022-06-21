import { GenericFactory } from "../../declarations"
import { UpdatableDimensions, UpdatableDimensionsDefinition, UpdatableDimensionsDefinitionObject, UpdatableDimensionsObject } from "../../Mixin/UpdatableDimensions/UpdatableDimensions"
import { Content, ContentDefinition, ContentDefinitionObject, ContentObject } from "../../Content/Content"
import { UpdatableDuration, UpdatableDurationDefinition, UpdatableDurationDefinitionObject, UpdatableDurationObject } from "../../Mixin/UpdatableDuration/UpdatableDuration"

export interface VideoSequenceObject extends ContentObject, UpdatableDimensionsObject, UpdatableDurationObject {
  speed?: number
}

export interface VideoSequence extends Content, UpdatableDimensions, UpdatableDuration {
  definition : VideoSequenceDefinition
  copy() : VideoSequence
  speed : number
}

export interface VideoSequenceDefinitionObject extends ContentDefinitionObject, UpdatableDimensionsDefinitionObject, UpdatableDurationDefinitionObject {
  begin?: number
  fps?: number
  increment?: number
  pattern?: string
  padding?: number
  audio?: string
}

export interface VideoSequenceDefinition extends ContentDefinition, UpdatableDimensionsDefinition, UpdatableDurationDefinition {
  instanceFromObject(object?: VideoSequenceObject): VideoSequence
}

/**
 * @category Factory
 */
export interface VideoSequenceFactory extends GenericFactory<
  VideoSequence, VideoSequenceObject, VideoSequenceDefinition, VideoSequenceDefinitionObject
> {}
