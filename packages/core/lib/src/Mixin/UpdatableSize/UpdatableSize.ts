import { Constrained } from "../../Base/Constrained"
import { SvgItem } from "../../Helpers/Svg/Svg"
import { errorThrow } from "../../Helpers/Error/ErrorFunctions"
import { Size } from "../../Utility/Size"

import { ImageType, VideoType } from "../../Setup/Enums"
import { MediaType, isMediaType } from "../../Setup/MediaType"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Rect } from "../../Utility/Rect"
import { Content, ContentDefinition, ContentDefinitionObject, ContentObject } from "../../Media/Content/Content"
import { isContent, isContentDefinition } from "../../Media/Content/ContentFunctions"

export const UpdatableSizeMediaType: MediaType[] = [
  ImageType,
  VideoType,
  // SequenceType,
]
export interface UpdatableSizeObject extends ContentObject {
}

export interface UpdatableSizeDefinitionObject extends ContentDefinitionObject {
  sourceSize?: Size
  previewSize?: Size
}

export interface UpdatableSize extends Content {
  svgItemForPlayerPromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem> 
  svgItemForTimelinePromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem> 
}

export const isUpdatableSize = (value?: any): value is UpdatableSize => {
  return isContent(value) 
}
export function assertUpdatableSize(value?: any): asserts value is UpdatableSize {
  if (!isUpdatableSize(value)) errorThrow(value, 'UpdatableSize') 
}

export const isUpdatableSizeType = (value: any): value is MediaType => {
  return isMediaType(value) && UpdatableSizeMediaType.includes(value)
}

export interface UpdatableSizeDefinition extends ContentDefinition {
  previewSize?: Size
  sourceSize?: Size
  alpha?: boolean
}
export const isUpdatableSizeDefinition = (value?: any): value is UpdatableSizeDefinition => {
  return isContentDefinition(value)
}
export function assertUpdatableSizeDefinition(value?: any): asserts value is UpdatableSizeDefinition {
  if (!isUpdatableSizeDefinition(value)) errorThrow(value, 'UpdatableSizeDefinition') 
}

export type UpdatableSizeClass = Constrained<UpdatableSize>
export type UpdatableSizeDefinitionClass = Constrained<UpdatableSizeDefinition>
