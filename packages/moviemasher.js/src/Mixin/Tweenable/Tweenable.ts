import { Constrained, Described, Scalar, UnknownObject} from "../../declarations"
import { CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, GraphFile, PreloadArgs, GraphFiles, VisibleCommandFileArgs, VisibleCommandFilterArgs, ServerPromiseArgs } from "../../MoveMe"
import { Actions } from "../../Editor/Actions/Actions"
import { Filter } from "../../Module/Filter/Filter"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Clip, IntrinsicOptions } from "../../Edited/Mash/Track/Clip/Clip"
import { MediaDefinitionType, Orientation } from "../../Setup/Enums"
import { Property } from "../../Setup/Property"
import { PointTuple } from "../../Utility/Point"
import { Rect, RectTuple } from "../../Utility/Rect"
import { SelectedProperties } from "../../Utility/SelectedProperty"
import { SizeTuple } from "../../Utility/Size"
import { Tweening } from "../../Utility/Tween"
import { Selectable } from "../../Editor/Selectable"
import { isMedia, Media } from "../../Media/Media"
import { Propertied } from "../../Base/Propertied"
import { isMediaInstance, MediaInstance } from "../../Media/MediaInstance/MediaInstance"

export interface TweenableObject extends UnknownObject {
  id?: string
  definitionId?: string
  definition?: Media
  label?: string
  container?: boolean
  x?: number
  xEnd?: number
  y?: number
  yEnd?: number

  lock?: string
}

export interface TweenableDefinitionObject extends  UnknownObject, Partial<Described> {
  type?: MediaDefinitionType | string
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
  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles 
  commandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters 
  container: boolean
  containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters
  containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters 
  containerFinalCommandFilters(args: VisibleCommandFilterArgs): CommandFilters 
  contentCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters 
  copyCommandFilter(input: string, track: number, prefix?: string): CommandFilter
  cropFilter: Filter
  definitionTime(masherTime: Time, clipRange: TimeRange): Time
  frames(quantize: number): number 
  fileCommandFiles(graphFileArgs: PreloadArgs): CommandFiles
  graphFiles(args: PreloadArgs): GraphFiles
  hasIntrinsicSizing: boolean
  hasIntrinsicTiming: boolean
  initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters
  intrinsicRect(editing?: boolean): Rect
  intrinsicsKnown(options: IntrinsicOptions): boolean
  intrinsicGraphFile(options: IntrinsicOptions): GraphFile
  // intrinsicUrls(options: IntrinsicOptions): string[]
  isDefault: boolean
  
  loadPromise(args: PreloadArgs): Promise<void>
  lock: Orientation
  mutable(): boolean
  muted: boolean

  overlayCommandFilters(bottomInput: string, topInput: string, alpha?: boolean): CommandFilters
  overlayFilter: Filter
  // preloadUrls(args: PreloadArgs): string[]
  scaleCommandFilters(args: CommandFilterArgs): CommandFilters 
  selectedProperties(actions: Actions, property: Property): SelectedProperties
  selectedProperty(property: Property): boolean 
  serverPromise(args: ServerPromiseArgs): Promise<void>
  tween(keyPrefix: string, time: Time, range: TimeRange): Scalar
  tweenPoints(time: Time, range: TimeRange): PointTuple 
  tweenRects(time: Time, range: TimeRange): RectTuple
  tweenSizes(time: Time, range: TimeRange): SizeTuple 
  tweenValues(key: string, time: Time, range: TimeRange): Scalar[] 
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
  serverPromise(args: ServerPromiseArgs): Promise<void>

}

export const isTweenableDefinition = (value?: any): value is TweenableDefinition => {
  return isMedia(value) 
}

export function assertTweenableDefinition(value?: any): asserts value is TweenableDefinition {
  if (!isTweenableDefinition(value)) throw new Error('expected TweenableDefinition')
}

export type TweenableClass = Constrained<Tweenable>
export type TweenableDefinitionClass = Constrained<TweenableDefinition>
