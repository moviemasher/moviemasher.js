import { Scalar} from "../../Types/Core"
import { Constrained } from "../../Base/Constrained"
import { CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, GraphFile, PreloadArgs, GraphFiles, VisibleCommandFileArgs, VisibleCommandFilterArgs, ServerPromiseArgs } from "../../Base/Code"
import { Filter } from "../../Plugin/Filter/Filter"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Clip, IntrinsicOptions } from "../../Media/Mash/Track/Clip/Clip"
import { Orientation } from "../../Setup/Enums"
import { MediaType } from "../../Setup/MediaType"
import { Property } from "../../Setup/Property"
import { PointTuple } from "../../Utility/Point"
import { Rect, RectTuple } from "../../Utility/Rect"
import { SelectedProperties } from "../../Helpers/Select/SelectedProperty"
import { SizeTuple } from "../../Utility/Size"
import { Tweening } from "../../Utility/Tween"
import { isMedia, isMediaInstance, Media, MediaInstance, MediaInstanceObject, MediaObject } from "../../Media/Media"
import { Selectable } from "../../Plugin/Masher/Selectable"
import { Actions } from "../../Plugin/Masher/Actions/Actions"

export interface TweenableObject extends MediaInstanceObject {
  mediaId?: string
  definition?: Media
  label?: string
  container?: boolean
  x?: number
  xEnd?: number
  y?: number
  yEnd?: number
  lock?: string
}

export interface TweenableDefinitionObject extends MediaObject {
  type?: MediaType | string
}

export interface Tweenable extends MediaInstance, Selectable {
  alphamergeCommandFilters(args: CommandFilterArgs): CommandFilters
  amixCommandFilters(args: CommandFilterArgs): CommandFilters
  canColor(args: CommandFilterArgs): boolean
  canColorTween(args: CommandFilterArgs): boolean
  clip: Clip
  clipped: boolean
  colorBackCommandFilters(args: VisibleCommandFilterArgs, output?: string): CommandFilters
  colorFilter: Filter  
  commandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters 
  container: boolean
  containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters
  containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters 
  containerFinalCommandFilters(args: VisibleCommandFilterArgs): CommandFilters 
  contentCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters 
  copyCommandFilter(input: string, track: number, prefix?: string): CommandFilter
  cropFilter: Filter
  definitionTime(masherTime: Time, clipRange: TimeRange): Time
  fileCommandFiles(graphFileArgs: PreloadArgs): CommandFiles
  frames(quantize: number): number 
  graphFiles(args: PreloadArgs): GraphFiles
  hasIntrinsicSizing: boolean
  hasIntrinsicTiming: boolean
  initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters
  intrinsicGraphFile(options: IntrinsicOptions): GraphFile
  intrinsicRect(editing?: boolean): Rect
  intrinsicsKnown(options: IntrinsicOptions): boolean
  isDefault: boolean
  loadPromise(args: PreloadArgs): Promise<void>
  lock: Orientation
  mutable(): boolean
  muted: boolean
  overlayCommandFilters(bottomInput: string, topInput: string, alpha?: boolean): CommandFilters
  overlayFilter: Filter
  scaleCommandFilters(args: CommandFilterArgs): CommandFilters 
  selectedProperties(actions: Actions, property: Property): SelectedProperties
  selectedProperty(property: Property): boolean 
  tween(keyPrefix: string, time: Time, range: TimeRange): Scalar
  tweenPoints(time: Time, range: TimeRange): PointTuple 
  tweenRects(time: Time, range: TimeRange): RectTuple
  tweenSizes(time: Time, range: TimeRange): SizeTuple 
  tweenValues(key: string, time: Time, range: TimeRange): Scalar[] 
  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles 
}
export const isTweenable = (value?: any): value is Tweenable => {
  return isMediaInstance(value) && isMedia(value.definition)
}
export function assertTweenable(value?: any): asserts value is Tweenable {
  if (!isTweenable(value)) throw new Error('expected Tweenable')
}

export interface TweenableDefinition extends Media {
  graphFiles(args: PreloadArgs): GraphFiles 
  loadPromise(args: PreloadArgs): Promise<void> 
}

export const isTweenableDefinition = (value?: any): value is TweenableDefinition => {
  return isMedia(value) 
}

export function assertTweenableDefinition(value?: any): asserts value is TweenableDefinition {
  if (!isTweenableDefinition(value)) throw new Error('expected TweenableDefinition')
}

export type TweenableClass = Constrained<Tweenable>
export type TweenableDefinitionClass = Constrained<TweenableDefinition>
