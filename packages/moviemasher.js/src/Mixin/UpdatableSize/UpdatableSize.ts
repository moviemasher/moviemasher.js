import { Constrained } from "../../Base/Constrained"
import { SvgItem } from "../../Helpers/Svg/Svg"
import { errorThrow } from "../../Helpers/Error/ErrorFunctions"
import { Size } from "../../Utility/Size"
import {
  isPreloadable, isPreloadableDefinition,
  Preloadable, PreloadableDefinition,
  PreloadableDefinitionObject, PreloadableObject
} from "../Preloadable/Preloadable"
import { MediaType, isMediaType, ImageType, VideoType } from "../../Setup/Enums"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Rect } from "../../Utility/Rect"

export const UpdatableSizeMediaType: MediaType[] = [
  ImageType,
  VideoType,
  // SequenceType,
]
export interface UpdatableSizeObject extends PreloadableObject {
}

export interface UpdatableSizeDefinitionObject extends PreloadableDefinitionObject {
  sourceSize?: Size
  previewSize?: Size
}

export interface UpdatableSize extends Preloadable {
  svgItemForPlayerPromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem> 
  svgItemForTimelinePromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem> 
}

export const isUpdatableSize = (value?: any): value is UpdatableSize => {
  return isPreloadable(value) 
}
export function assertUpdatableSize(value?: any): asserts value is UpdatableSize {
  if (!isUpdatableSize(value)) errorThrow(value, 'UpdatableSize') 
}

export const isUpdatableSizeType = (value: any): value is MediaType => {
  return isMediaType(value) && UpdatableSizeMediaType.includes(value)
}

export interface UpdatableSizeDefinition extends PreloadableDefinition {
  previewSize?: Size
  sourceSize?: Size
  alpha?: boolean
}
export const isUpdatableSizeDefinition = (value?: any): value is UpdatableSizeDefinition => {
  return isPreloadableDefinition(value)
}
export function assertUpdatableSizeDefinition(value?: any): asserts value is UpdatableSizeDefinition {
  if (!isUpdatableSizeDefinition(value)) errorThrow(value, 'UpdatableSizeDefinition') 
}

export type UpdatableSizeClass = Constrained<UpdatableSize>
export type UpdatableSizeDefinitionClass = Constrained<UpdatableSizeDefinition>
