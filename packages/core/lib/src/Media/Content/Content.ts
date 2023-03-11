import { Constrained } from "../../Base/Constrained"
import { SvgItem } from "../../Helpers/Svg/Svg"
import { Rect, RectTuple } from "../../Utility/Rect"
import { Tweenable, TweenableDefinition, TweenableDefinitionObject, TweenableObject } from "../../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters, Component, VisibleCommandFileArgs } from "../../Base/Code"
import { EffectObject, Effects } from "../Effect/Effect"
import { Size } from "../../Utility/Size"

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


export interface ContentDefinition extends TweenableDefinition {}

export type ContentClass = Constrained<Content>
export type ContentDefinitionClass = Constrained<ContentDefinition>
