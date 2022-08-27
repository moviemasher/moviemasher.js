import { Constrained,  GenericFactory,  SvgItem } from "../declarations"
import { Rect, RectTuple } from "../Utility/Rect"
import { isContentType, Orientation } from "../Setup/Enums"
import { throwError } from "../Utility/Throw"
import { isTweenable, isTweenableDefinition, Tweenable, TweenableDefinition, TweenableDefinitionObject, TweenableObject } from "../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters } from "../MoveMe"

export interface ContentObject extends TweenableObject {
  lock?: string
}

export interface ContentDefinitionObject extends TweenableDefinitionObject { }

export interface ContentRectArgs {
  rects: Rect | RectTuple
  time: Time
  timeRange: TimeRange
  loading?: boolean
  editing?: boolean
}
export interface Content extends Tweenable {
  contentRects(args: ContentRectArgs): RectTuple 
  contentSvgItem(rect: Rect, time: Time, range: TimeRange, icon?: boolean): SvgItem
  lock: Orientation
  svgItem(rect: Rect, time: Time, range: TimeRange, stretch?: boolean, icon?: boolean): SvgItem
  audibleCommandFilters(args: CommandFilterArgs): CommandFilters
  audibleCommandFiles(args: CommandFileArgs): CommandFiles
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
