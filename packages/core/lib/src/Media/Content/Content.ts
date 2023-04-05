import { Constrained } from '../../Base/Constrained.js'
import { SvgItem } from '../../Helpers/Svg/Svg.js'
import { Rect, RectTuple } from '../../Utility/Rect.js'
import { Tweenable, TweenableDefinition, TweenableDefinitionObject, TweenableObject } from '../../Mixin/Tweenable/Tweenable.js'
import { Time, TimeRange } from '../../Helpers/Time/Time.js'
import { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters, Component, VisibleCommandFileArgs } from '../../Base/Code.js'
import { EffectObject, Effects } from '../Effect/Effect.js'
import { Size } from '../../Utility/Size.js'

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
