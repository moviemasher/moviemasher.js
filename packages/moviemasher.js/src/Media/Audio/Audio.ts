import { Content, ContentObject, isContent } from "../Content/Content"
import { UpdatableDuration, UpdatableDurationDefinition, UpdatableDurationDefinitionObject, UpdatableDurationObject } from "../../Mixin/UpdatableDuration/UpdatableDuration"
import { DefinitionType } from "../../Setup/Enums"
import { isMedia, Media, MediaObject } from "../Media"


export interface AudioObject extends ContentObject, UpdatableDurationObject {}

export interface Audio extends Content, UpdatableDuration {
  definition : AudioDefinition
}
export const isAudio = (value: any): value is Audio => {
  return isContent(value) && isAudioDefinition(value.definition)
}

export interface AudioDefinitionObject extends MediaObject, UpdatableDurationDefinitionObject { 
}

export interface AudioDefinition extends Media, UpdatableDurationDefinition {
  instanceFromObject(object?: AudioObject): Audio
}

export const isAudioDefinition = (value: any): value is AudioDefinition => {
  return isMedia(value) && value.type === DefinitionType.Audio
}
