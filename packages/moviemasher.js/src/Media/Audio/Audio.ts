import { Content, ContentObject, isContent } from "../Content/Content"
import { UpdatableDuration, UpdatableDurationDefinition, UpdatableDurationDefinitionObject, UpdatableDurationObject } from "../../Mixin/UpdatableDuration/UpdatableDuration"
import { AudioType } from "../../Setup/Enums"
import { isMedia, Media, MediaObject } from "../Media"


export interface AudioObject extends ContentObject, UpdatableDurationObject {
  definition?: AudioMedia
}

export interface Audio extends Content, UpdatableDuration {
  definition : AudioMedia
}
export const isAudio = (value: any): value is Audio => {
  return isContent(value) && isAudioMedia(value.definition)
}

export interface AudioMediaObject extends MediaObject, UpdatableDurationDefinitionObject { 
}

/**
 * @category Media
 */
export interface AudioMedia extends Media, UpdatableDurationDefinition {
  type: AudioType
  instanceFromObject(object?: AudioObject): Audio
}

export const isAudioMedia = (value: any): value is AudioMedia => {
  return isMedia(value) && value.type === AudioType
}
