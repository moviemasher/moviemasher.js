import { Constrained, Scalar} from "../../declarations"
import { CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, GraphFile, GraphFileArgs, GraphFiles, VisibleCommandFileArgs, VisibleCommandFilterArgs } from "../../MoveMe"
import { Definition, DefinitionObject, isDefinition } from "../../Definition/Definition"
import { Actions } from "../../Editor/Actions/Actions"
import { Filter } from "../../Filter/Filter"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Instance, InstanceObject, isInstance } from "../../Instance/Instance"
import { Clip, IntrinsicOptions } from "../../Edited/Mash/Track/Clip/Clip"
import { EffectObject, Effects } from "../../Media/Effect/Effect"
import { Orientation } from "../../Setup/Enums"
import { Property } from "../../Setup/Property"
import { PointTuple } from "../../Utility/Point"
import { Rect, RectTuple } from "../../Utility/Rect"
import { SelectedProperties } from "../../Utility/SelectedProperty"
import { SizeTuple } from "../../Utility/Size"
import { Tweening } from "../../Utility/Tween"
import { Selectable } from "../../Editor/Selectable"

export interface TweenableObject extends InstanceObject {
  container?: boolean
  x?: number
  xEnd?: number
  y?: number
  yEnd?: number

  lock?: string
}

export interface TweenableDefinitionObject extends DefinitionObject {}

export interface Tweenable extends Instance, Selectable { 
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
  fileCommandFiles(graphFileArgs: GraphFileArgs): CommandFiles
  fileUrls(args: GraphFileArgs): GraphFiles
  hasIntrinsicSizing: boolean
  hasIntrinsicTiming: boolean
  initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters
  intrinsicRect(editing?: boolean): Rect
  intrinsicsKnown(options: IntrinsicOptions): boolean
  intrinsicGraphFile(options: IntrinsicOptions): GraphFile
  isDefault: boolean
  
  lock: Orientation
  mutable(): boolean
  muted: boolean

  overlayCommandFilters(bottomInput: string, topInput: string): CommandFilters
  overlayFilter: Filter
  scaleCommandFilters(args: CommandFilterArgs): CommandFilters 
  selectedProperties(actions: Actions, property: Property): SelectedProperties
  selectedProperty(property: Property): boolean 
  tween(keyPrefix: string, time: Time, range: TimeRange): Scalar
  tweenPoints(time: Time, range: TimeRange): PointTuple 
  tweenRects(time: Time, range: TimeRange): RectTuple
  tweenSizes(time: Time, range: TimeRange): SizeTuple 
  tweenValues(key: string, time: Time, range: TimeRange): Scalar[] 
}

export const isTweenable = (value?: any): value is Tweenable => {
  return isInstance(value) && isDefinition(value.definition)
}
export function assertTweenable(value?: any): asserts value is Tweenable {
  if (!isTweenable(value)) throw new Error('expected Tweenable')
}

export interface TweenableDefinition extends Definition {
  
}

export const isTweenableDefinition = (value?: any): value is TweenableDefinition => {
  return isDefinition(value) 
}

export function assertTweenableDefinition(value?: any): asserts value is TweenableDefinition {
  if (!isTweenableDefinition(value)) throw new Error('expected TweenableDefinition')
}

export type TweenableClass = Constrained<Tweenable>
export type TweenableDefinitionClass = Constrained<TweenableDefinition>
