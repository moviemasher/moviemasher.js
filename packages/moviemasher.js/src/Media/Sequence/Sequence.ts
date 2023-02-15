import { UpdatableSize, UpdatableSizeDefinition, UpdatableSizeDefinitionObject, UpdatableSizeObject } from "../../Mixin/UpdatableSize/UpdatableSize"
import { Content, ContentDefinition, ContentDefinitionObject, ContentObject } from "../Content/Content"
import { UpdatableDuration, UpdatableDurationDefinition, UpdatableDurationDefinitionObject, UpdatableDurationObject } from "../../Mixin/UpdatableDuration/UpdatableDuration"
import { Time } from "../../Helpers/Time/Time"
import { SequenceType } from "../../Setup/Enums"

export interface SequenceObject extends ContentObject, UpdatableSizeObject, UpdatableDurationObject {
  speed?: number
  definition? : SequenceMedia
}

export interface Sequence extends Content, UpdatableSize, UpdatableDuration {
  definition : SequenceMedia
  speed : number
}

export interface SequenceMediaObject extends ContentDefinitionObject, UpdatableSizeDefinitionObject, UpdatableDurationDefinitionObject {
  begin?: number
  fps?: number
  increment?: number
  pattern?: string
  padding?: number
}

/**
 * @category Media
 */
export interface SequenceMedia extends ContentDefinition, UpdatableSizeDefinition, UpdatableDurationDefinition {
  type: SequenceType
  instanceFromObject(object?: SequenceObject): Sequence
  framesArray(start: Time): number[]
  // urlForFrame(frame : number): string
}
