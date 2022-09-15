import { Constrained,  GenericFactory,  SvgItem } from "../declarations"
import { Rect, RectTuple } from "../Utility/Rect"
import { isContentType, Orientation } from "../Setup/Enums"
import { throwError } from "../Utility/Throw"
import { isTweenable, isTweenableDefinition, Tweenable, TweenableDefinition, TweenableDefinitionObject, TweenableObject } from "../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters } from "../MoveMe"
import { IdPrefix, IdSuffix } from "../Setup/Constants"

export const ContentDefaultId = `${IdPrefix}content${IdSuffix}`
export interface ContentObject extends TweenableObject {
  lock?: string
}

export interface ContentDefinitionObject extends TweenableDefinitionObject { }

export interface ContentRectArgs {
  containerRects: Rect | RectTuple
  editing?: boolean
  loading?: boolean
  time: Time
  timeRange: TimeRange
}
export interface Content extends Tweenable {
  audibleCommandFiles(args: CommandFileArgs): CommandFiles
  audibleCommandFilters(args: CommandFilterArgs): CommandFilters
  contentPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, icon?: boolean): Promise<SvgItem>
  contentRect(containerRect: Rect, time: Time, timeRange: TimeRange): Rect
  contentRects(args: ContentRectArgs): RectTuple 
  itemPromise(containerRect: Rect, time: Time, range: TimeRange, stretch?: boolean, icon?: boolean): Promise<SvgItem>
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
