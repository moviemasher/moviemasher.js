import { Content, ContentDefinition, ContentDefinitionObject, ContentObject, isContent } from "../../Content/Content"
import { GenericFactory, LoadedAudio } from "../../declarations"
import { isUpdatableDuration, UpdatableDuration, UpdatableDurationDefinition, UpdatableDurationObject } from "../../Mixin/UpdatableDuration/UpdatableDuration"


export interface AudioObject extends ContentObject, UpdatableDurationObject {}

export interface Audio extends Content, UpdatableDuration {
  definition : AudioDefinition
}
export const isAudio = (value: any): value is Audio => {
  return isContent(value) && isUpdatableDuration(value)
}

export interface AudioDefinitionObject extends ContentDefinitionObject, UpdatableDurationObject { 
  loadedAudio?: LoadedAudio
}

export interface AudioDefinition extends ContentDefinition, UpdatableDurationDefinition {
  instanceFromObject(object?: AudioObject): Audio
  loadedAudio?: LoadedAudio
}

/**
 * @category Factory
 */
export interface AudioFactory extends GenericFactory<
  Audio, AudioObject, AudioDefinition, AudioDefinitionObject
> { }
