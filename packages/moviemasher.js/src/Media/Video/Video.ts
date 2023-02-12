import { LoadedImage, LoadedVideo } from "../../Load/Loaded"
import { VideoType } from "../../Setup/Enums"
import {
  UpdatableSize, UpdatableSizeDefinition, UpdatableSizeDefinitionObject, 
  UpdatableSizeObject
} from "../../Mixin/UpdatableSize/UpdatableSize"
import { Content, ContentObject } from "../Content/Content"
import { 
  UpdatableDuration, UpdatableDurationDefinition, 
  UpdatableDurationDefinitionObject, UpdatableDurationObject 
} from "../../Mixin/UpdatableDuration/UpdatableDuration"
import { isMedia, Media, MediaObject } from "../Media"
import { Time } from "../../Helpers/Time/Time"
import { Size } from "../../Utility/Size"
import { isMediaInstance } from "../MediaInstance/MediaInstance"
import { Requestable } from "../../Base/Requestable/Requestable"

export interface VideoObject extends ContentObject, UpdatableSizeObject, UpdatableDurationObject {
  speed?: number
  definition?: VideoDefinition
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
  type: VideoType
  instanceFromObject(object?: VideoObject): Video
  loadedVideo?: LoadedVideo
  readonly previewTranscoding: Requestable
  loadedImagePromise(definitionTime: Time, outSize?: Size): Promise<LoadedImage>
}
export const isVideoDefinition = (value: any): value is VideoDefinition => {
  return isMedia(value) && value.type === VideoType
}
export function assertVideoDefinition(value: any): asserts value is VideoDefinition {
  if (!isVideoDefinition(value)) throw new Error('expected VideoDefinition')
}

export const isVideo = (value: any): value is Video => {
  return isMediaInstance(value) && value.definition.type === VideoType
}

export function assertVideo(value: any): asserts value is Video {
  if (!isVideo(value)) throw new Error('expected Video')
}
