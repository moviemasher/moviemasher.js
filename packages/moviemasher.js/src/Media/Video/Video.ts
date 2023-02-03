import { LoadedImage, LoadedVideo } from "../../declarations"
import { DefinitionType } from "../../Setup/Enums"
import { isInstance } from "../../Instance/Instance"
import {
  UpdatableSize, UpdatableSizeDefinition, UpdatableSizeDefinitionObject, 
  UpdatableSizeObject
} from "../../Mixin/UpdatableSize/UpdatableSize"
import {
  Content, ContentObject
} from "../Content/Content"
import { UpdatableDuration, UpdatableDurationDefinition, 
  UpdatableDurationDefinitionObject, UpdatableDurationObject 
} from "../../Mixin/UpdatableDuration/UpdatableDuration"
import { isDefinition } from "../../Definition"
import { isMedia, Media, MediaObject } from "../Media"
import { Transcoding } from "../Transcoding/Transcoding"
import { Time } from "../../Helpers/Time/Time"
import { Size } from "../../Utility/Size"

export interface VideoObject extends ContentObject, UpdatableSizeObject, UpdatableDurationObject {
  speed?: number
}

export interface Video extends Content, UpdatableSize, UpdatableDuration {
  definition : VideoDefinition
  loadedVideo?: LoadedVideo
}

export interface VideoDefinitionObject extends UpdatableSizeDefinitionObject, UpdatableDurationDefinitionObject {
  loadedVideo?: LoadedVideo
}

export type VideoTransitionalObject = MediaObject | VideoDefinitionObject

export interface VideoDefinition extends Media, UpdatableSizeDefinition, UpdatableDurationDefinition {
  instanceFromObject(object?: VideoObject): Video
  loadedVideo?: LoadedVideo
  readonly previewTranscoding: Transcoding
  loadedImagePromise(definitionTime: Time, outSize?: Size): Promise<LoadedImage>
}
export const isVideoDefinition = (value: any): value is VideoDefinition => {
  return isMedia(value) && value.type === DefinitionType.Video
}
export function assertVideoDefinition(value: any): asserts value is VideoDefinition {
  if (!isVideoDefinition(value)) throw new Error('expected VideoDefinition')
}

export const isVideo = (value: any): value is Video => {
  return isInstance(value) && value.definition.type === DefinitionType.Video
}

export function assertVideo(value: any): asserts value is Video {
  if (!isVideo(value)) throw new Error('expected Video')
}
