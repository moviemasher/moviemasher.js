import { Constrained, SvgItem } from "../../declarations"
import { errorsThrow } from "../../Utility/Errors"
import { Size } from "../../Utility/Size"
import {
  isPreloadable, isPreloadableDefinition,
  Preloadable, PreloadableDefinition,
  PreloadableDefinitionObject, PreloadableObject
} from "../Preloadable/Preloadable"
import { DefinitionType, isDefinitionType } from "../../Setup/Enums"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Rect } from "../../Utility/Rect"

export const UpdatableSizeDefinitionType = [
  DefinitionType.Image,
  DefinitionType.Video,
  // DefinitionType.VideoSequence,
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
  if (!isUpdatableSize(value)) errorsThrow(value, 'UpdatableSize') 
}

export const isUpdatableSizeType = (value: any): value is DefinitionType => {
  return isDefinitionType(value) && UpdatableSizeDefinitionType.includes(value)
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
  if (!isUpdatableSizeDefinition(value)) errorsThrow(value, 'UpdatableSizeDefinition') 
}

export type UpdatableSizeClass = Constrained<UpdatableSize>
export type UpdatableSizeDefinitionClass = Constrained<UpdatableSizeDefinition>
