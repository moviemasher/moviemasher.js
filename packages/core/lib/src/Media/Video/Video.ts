import type {ClientImage, ClientVideo} from '../../Helpers/ClientMedia/ClientMedia.js'
import type { VideoType} from '../../Setup/Enums.js'
import type {
  UpdatableSize, UpdatableSizeDefinition, UpdatableSizeDefinitionObject, 
  UpdatableSizeObject
} from '../../Mixin/UpdatableSize/UpdatableSize.js'
import type {Content, ContentObject} from '../Content/Content.js'
import type { 
  UpdatableDuration, UpdatableDurationDefinition, 
  UpdatableDurationDefinitionObject, UpdatableDurationObject 
} from '../../Mixin/UpdatableDuration/UpdatableDuration.js'
import type {Time} from '../../Helpers/Time/Time.js'
import type {Size} from '../../Utility/Size.js'
import type {Requestable} from '../../Base/Requestable/Requestable.js'
import type {Media} from '../Media.js'

import {isMedia, isMediaInstance} from '../MediaFunctions.js'
import {TypeVideo} from '../../Setup/Enums.js'

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
  return isMedia(value) && value.type === TypeVideo
}
export function assertVideoMedia(value: any): asserts value is VideoMedia {
  if (!isVideoMedia(value)) throw new Error('expected VideoMedia')
}

export const isVideo = (value: any): value is Video => {
  return isMediaInstance(value) && value.definition.type === TypeVideo
}

export function assertVideo(value: any): asserts value is Video {
  if (!isVideo(value)) throw new Error('expected Video')
}
