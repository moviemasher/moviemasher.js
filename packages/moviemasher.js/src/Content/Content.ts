import { Constrained,  GenericFactory,  SvgContent } from "../declarations"
import { Rect, RectTuple } from "../Utility/Rect"
import { Size } from "../Utility/Size"
import { ColorTuple, CommandFilterArgs, CommandFilters, SelectedProperties } from "../MoveMe"
import { isContentType, Orientation, SelectType } from "../Setup/Enums"
import { throwError } from "../Utility/Is"
import { Actions } from "../Editor/Actions/Actions"
import { isTweenable, isTweenableDefinition, Tweenable, TweenableDefinition, TweenableDefinitionObject, TweenableObject } from "../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../Helpers/Time/Time"

export interface ContentObject extends TweenableObject {
  lock?: string
}

export interface ContentDefinitionObject extends TweenableDefinitionObject { }

export interface Content extends Tweenable {
  mutable: boolean
  muted: boolean
  lock: Orientation
  contentSvg(rect: Rect, time: Time, range: TimeRange): SvgContent
  svgContent(rect: Rect, time: Time, range: TimeRange, stretch?: boolean): SvgContent
  contentRects(rects: RectTuple, time: Time, timeRange: TimeRange, forFiles?: boolean): RectTuple 
}
export const isContent = (value?: any): value is Content => {
  return isTweenable(value) && isContentType(value.type)
}
export function assertContent(value?: any, name?: string): asserts value is Content {
  if (!isContent(value)) throwError(value, 'Content', name)
}

export interface ContentDefinition extends TweenableDefinition {}
export const isContentDefinition = (value?: any): value is ContentDefinition => {
  return isTweenableDefinition(value) && isContentType(value.type)
}

export type ContentClass = Constrained<Content>
export type ContentDefinitionClass = Constrained<ContentDefinition>


/**
 * @category Factory
 */
 export interface ContentFactory extends GenericFactory<Content, ContentObject, ContentDefinition, ContentDefinitionObject> { }
