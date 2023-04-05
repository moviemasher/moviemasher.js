import type {Constrained} from '../../Base/Constrained.js'
import type {Content, ContentDefinition, ContentDefinitionObject, ContentObject} from '../../Media/Content/Content.js'
import type {MediaType} from '../../Setup/MediaType.js'
import type {Rect} from '../../Utility/Rect.js'
import type {Size} from '../../Utility/Size.js'
import type {SvgItem} from '../../Helpers/Svg/Svg.js'
import type {Time, TimeRange} from '../../Helpers/Time/Time.js'

import { isMediaType} from '../../Setup/MediaType.js'
import {errorThrow} from '../../Helpers/Error/ErrorFunctions.js'
import {isContent, isContentDefinition} from '../../Media/Content/ContentFunctions.js'
import {TypeImage, TypeVideo} from '../../Setup/Enums.js'

export const UpdatableSizeMediaType: MediaType[] = [TypeImage, TypeVideo ]
export interface UpdatableSizeObject extends ContentObject {}

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
