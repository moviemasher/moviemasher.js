import { Constrained,  GenericFactory,  SvgItem } from "../declarations"
import { Rect, RectTuple } from "../Utility/Rect"
import { isContentType } from "../Setup/Enums"
import { throwError } from "../Utility/Throw"
import { isTweenable, isTweenableDefinition, Tweenable, TweenableDefinition, TweenableDefinitionObject, TweenableObject } from "../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters, VisibleCommandFileArgs, VisibleCommandFilterArgs } from "../MoveMe"
import { IdPrefix, IdSuffix } from "../Setup/Constants"
import { EffectObject, Effects } from "../Media/Effect/Effect"
import { Size } from "../Utility/Size"

export const DefaultContentId = `${IdPrefix}content${IdSuffix}`
export interface ContentObject extends TweenableObject {
  effects?: EffectObject[]
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
  contentRects(args: ContentRectArgs): RectTuple 
  contentSvgFilter(contentItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined
  effects: Effects
  effectsCommandFiles(args: VisibleCommandFileArgs): CommandFiles
  itemPromise(containerRect: Rect, time: Time, range: TimeRange, icon?: boolean): Promise<SvgItem>
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
