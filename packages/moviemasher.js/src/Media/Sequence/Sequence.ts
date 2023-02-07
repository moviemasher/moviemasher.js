import { UpdatableSize, UpdatableSizeDefinition, UpdatableSizeDefinitionObject, UpdatableSizeObject } from "../../Mixin/UpdatableSize/UpdatableSize"
import { Content, ContentDefinition, ContentDefinitionObject, ContentObject } from "../Content/Content"
import { UpdatableDuration, UpdatableDurationDefinition, UpdatableDurationDefinitionObject, UpdatableDurationObject } from "../../Mixin/UpdatableDuration/UpdatableDuration"
import { Time } from "../../Helpers/Time/Time"

export interface SequenceObject extends ContentObject, UpdatableSizeObject, UpdatableDurationObject {
  speed?: number
}

export interface Sequence extends Content, UpdatableSize, UpdatableDuration {
  definition : SequenceDefinition
  speed : number
}

export interface SequenceDefinitionObject extends ContentDefinitionObject, UpdatableSizeDefinitionObject, UpdatableDurationDefinitionObject {
  begin?: number
  fps?: number
  increment?: number
  pattern?: string
  padding?: number
}

export interface SequenceDefinition extends ContentDefinition, UpdatableSizeDefinition, UpdatableDurationDefinition {
  instanceFromObject(object?: SequenceObject): Sequence
  framesArray(start: Time): number[]
  // urlForFrame(frame : number): string
}
