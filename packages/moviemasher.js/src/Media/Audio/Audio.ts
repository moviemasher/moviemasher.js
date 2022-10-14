import { Content, ContentDefinition, ContentDefinitionObject, ContentObject, isContent } from "../../Content/Content"
import { GenericFactory } from "../../declarations"
import { isDefinition } from "../../Definition/Definition"
import { UpdatableDuration, UpdatableDurationDefinition, UpdatableDurationDefinitionObject, UpdatableDurationObject } from "../../Mixin/UpdatableDuration/UpdatableDuration"
import { DefinitionType } from "../../Setup/Enums"


export interface AudioObject extends ContentObject, UpdatableDurationObject {}

export interface Audio extends Content, UpdatableDuration {
  definition : AudioDefinition
}
export const isAudio = (value: any): value is Audio => {
  return isContent(value) && isAudioDefinition(value.definition)
}

export interface AudioDefinitionObject extends ContentDefinitionObject, UpdatableDurationDefinitionObject { 
}

export interface AudioDefinition extends ContentDefinition, UpdatableDurationDefinition {
  instanceFromObject(object?: AudioObject): Audio
}

export const isAudioDefinition = (value: any): value is AudioDefinition => {
  return isDefinition(value) && value.type === DefinitionType.Audio
}

/**
 * @category Factory
 */
export interface AudioFactory extends GenericFactory<
  Audio, AudioObject, AudioDefinition, AudioDefinitionObject
> { }
