import { GenericFactory, LoadedVideo } from "../../declarations"
import { DefinitionType } from "../../Setup/Enums"
import { isInstance } from "../../Instance/Instance"
import {
  UpdatableSize, UpdatableSizeDefinition, UpdatableSizeDefinitionObject, 
  UpdatableSizeObject
} from "../../Mixin/UpdatableSize/UpdatableSize"
import {
  Content, ContentDefinition, ContentDefinitionObject, ContentObject
} from "../../Content/Content"
import { UpdatableDuration, UpdatableDurationDefinition, 
  UpdatableDurationDefinitionObject, UpdatableDurationObject 
} from "../../Mixin/UpdatableDuration/UpdatableDuration"
import { isDefinition } from "../../Definition"

export interface VideoObject extends ContentObject, UpdatableSizeObject, UpdatableDurationObject {
  speed?: number
}

export interface Video extends Content, UpdatableSize, UpdatableDuration {
  definition : VideoDefinition
}

export interface VideoDefinitionObject extends ContentDefinitionObject, UpdatableSizeDefinitionObject, UpdatableDurationDefinitionObject {
  loadedVideo?: LoadedVideo
}

export interface VideoDefinition extends ContentDefinition, UpdatableSizeDefinition, UpdatableDurationDefinition {
  instanceFromObject(object?: VideoObject): Video
  loadedVideo?: LoadedVideo
}
export const isVideoDefinition = (value: any): value is VideoDefinition => {
  return isDefinition(value) && value.type === DefinitionType.Video
}

export const isVideo = (value: any): value is Video => {
  return isInstance(value) && value.definition.type === DefinitionType.Video
}

export function assertVideo(value: any): asserts value is Video {
  if (!isVideo(value)) throw new Error('expected Video')
}

/**
 * @category Factory
 */
export interface VideoFactory extends GenericFactory<
  Video, VideoObject, VideoDefinition, VideoDefinitionObject
> {}
