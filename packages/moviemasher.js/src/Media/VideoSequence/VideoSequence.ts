import { GenericFactory, LoadedAudio } from "../../declarations"
import { UpdatableSize, UpdatableSizeDefinition, UpdatableSizeDefinitionObject, UpdatableSizeObject } from "../../Mixin/UpdatableSize/UpdatableSize"
import { Content, ContentDefinition, ContentDefinitionObject, ContentObject } from "../../Content/Content"
import { UpdatableDuration, UpdatableDurationDefinition, UpdatableDurationDefinitionObject, UpdatableDurationObject } from "../../Mixin/UpdatableDuration/UpdatableDuration"
import { Time } from "../../Helpers/Time/Time"

export interface VideoSequenceObject extends ContentObject, UpdatableSizeObject, UpdatableDurationObject {
  speed?: number
}

export interface VideoSequence extends Content, UpdatableSize, UpdatableDuration {
  definition : VideoSequenceDefinition
  // copy() : VideoSequence
  speed : number
}

export interface VideoSequenceDefinitionObject extends ContentDefinitionObject, UpdatableSizeDefinitionObject, UpdatableDurationDefinitionObject {
  begin?: number
  fps?: number
  increment?: number
  pattern?: string
  padding?: number
}

export interface VideoSequenceDefinition extends ContentDefinition, UpdatableSizeDefinition, UpdatableDurationDefinition {
  instanceFromObject(object?: VideoSequenceObject): VideoSequence
  framesArray(start: Time): number[]
  urlForFrame(frame : number): string
}

/**
 * @category Factory
 */
export interface VideoSequenceFactory extends GenericFactory<
  VideoSequence, VideoSequenceObject, VideoSequenceDefinition, VideoSequenceDefinitionObject
> {}
