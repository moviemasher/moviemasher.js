import { ClientImage, ClientVideo } from "../../Helpers/ClientMedia/ClientMedia"
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
import { isMedia, isMediaInstance, Media, MediaObject } from "../Media"
import { Time } from "../../Helpers/Time/Time"
import { Size } from "../../Utility/Size"
import { Requestable } from "../../Base/Requestable/Requestable"

export interface VideoObject extends ContentObject, UpdatableSizeObject, UpdatableDurationObject {
  speed?: number
  definition?: VideoMedia
}

export interface Video extends Content, UpdatableSize, UpdatableDuration {
  definition : VideoMedia
  loadedVideo?: ClientVideo
}

export interface VideoMediaObject extends UpdatableSizeDefinitionObject, UpdatableDurationDefinitionObject {
  loadedVideo?: ClientVideo
}


/**
 * @category Media
 */
export interface VideoMedia extends Media, UpdatableSizeDefinition, UpdatableDurationDefinition {
  type: VideoType
  instanceFromObject(object?: VideoObject): Video
  loadedVideo?: ClientVideo
  readonly previewTranscoding: Requestable
  loadedImagePromise(definitionTime: Time, outSize?: Size): Promise<ClientImage>
}
export const isVideoMedia = (value: any): value is VideoMedia => {
  return isMedia(value) && value.type === VideoType
}
export function assertVideoMedia(value: any): asserts value is VideoMedia {
  if (!isVideoMedia(value)) throw new Error('expected VideoMedia')
}

export const isVideo = (value: any): value is Video => {
  return isMediaInstance(value) && value.definition.type === VideoType
}

export function assertVideo(value: any): asserts value is Video {
  if (!isVideo(value)) throw new Error('expected Video')
}
