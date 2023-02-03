import { Constrained,  SvgItem } from "../../declarations"
import { Rect, RectTuple } from "../../Utility/Rect"
import { isContentType } from "../../Setup/Enums"
import { errorsThrow } from "../../Utility/Errors"
import { isTweenable, isTweenableDefinition, Tweenable, TweenableDefinition, TweenableDefinitionObject, TweenableObject } from "../../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters, Component, VisibleCommandFileArgs } from "../../MoveMe"
import { IdPrefix, IdSuffix } from "../../Setup/Constants"
import { EffectObject, Effects } from "../../Module/Effect/Effect"
import { Size } from "../../Utility/Size"

export const DefaultContentId = `${IdPrefix}content.image${IdSuffix}`

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
  contentPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem>
  contentRects(args: ContentRectArgs): RectTuple 
  contentSvgFilter(contentItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined
  contentSvgItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem>
  effects: Effects
  effectsCommandFiles(args: VisibleCommandFileArgs): CommandFiles
}
export const isContent = (value?: any): value is Content => {
  return isTweenable(value) && isContentType(value.type)
}
export function assertContent(value?: any, name?: string): asserts value is Content {
  if (!isContent(value)) errorsThrow(value, 'Content', name)
}

export interface ContentDefinition extends TweenableDefinition {}
export const isContentDefinition = (value?: any): value is ContentDefinition => {
  return isTweenableDefinition(value) && isContentType(value.type)
}

export type ContentClass = Constrained<Content>
export type ContentDefinitionClass = Constrained<ContentDefinition>


