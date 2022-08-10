import { Constrained, Scalar, SvgItem} from "../../declarations"
import { Definition, DefinitionObject, isDefinition } from "../../Definition/Definition"
import { Actions } from "../../Editor/Actions/Actions"
import { Filter } from "../../Filter/Filter"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Instance, InstanceObject } from "../../Instance/Instance"
import { Clip } from "../../Edited/Mash/Track/Clip/Clip"
import { EffectObject, Effects } from "../../Media/Effect/Effect"
import { CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, GraphFileArgs, GraphFiles, VisibleCommandFileArgs, VisibleCommandFilterArgs } from "../../MoveMe"
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
  content?: boolean
  x?: number
  xEnd?: number
  y?: number
  yEnd?: number
  offN?: boolean
  offS?: boolean
  offE?: boolean
  offW?: boolean
  lock?: string
  effects?: EffectObject[]
}

export interface TweenableDefinitionObject extends DefinitionObject {}

export interface Tweenable extends Instance, Selectable { 
  alphamergeCommandFilters(args: CommandFilterArgs): CommandFilters
  alphamergeFilter: Filter
  amixCommandFilters(args: CommandFilterArgs): CommandFilters
  canColor(args: CommandFilterArgs): boolean
  canColorTween(args: CommandFilterArgs): boolean
  clip: Clip
  colorBackCommandFilters(args: VisibleCommandFilterArgs, output?: string): CommandFilters
  colorFilter: Filter  
  commandFiles(args: VisibleCommandFileArgs): CommandFiles 
  commandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters 
  container: boolean
  containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters
  containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters 
  containerFinalCommandFilters(args: VisibleCommandFilterArgs): CommandFilters 
  contentCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters 
  copyCommandFilter(input: string, track: number, prefix?: string): CommandFilter
  cropFilter: Filter
  definitionTime(masherTime: Time, clipRange: TimeRange): Time
  effects: Effects
  effectsCommandFilters(args: VisibleCommandFilterArgs): CommandFilters 
  foreignElement: SVGForeignObjectElement
  foreignSvgItem(element: SvgItem, rect: Rect, stretch?: boolean): SVGForeignObjectElement
  graphCommandFiles(graphFileArgs: GraphFileArgs): CommandFiles
  graphFiles(args: GraphFileArgs): GraphFiles
  initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters
  intrinsicRect(editing?: boolean): Rect
  intrinsicsKnown(editing?: boolean): boolean
  isDefault: boolean
  lock: Orientation
  mutable(): boolean
  muted: boolean
  offE: boolean
  offN: boolean
  offS: boolean
  offW: boolean
  overlayCommandFilters(bottomInput: string, topInput: string): CommandFilters
  overlayFilter: Filter
  scaleCommandFilters(args: CommandFilterArgs): CommandFilters 
  selectedProperties(actions: Actions, property: Property): SelectedProperties
  setptsFilter: Filter
  setsarFilter: Filter
  tween(keyPrefix: string, time: Time, range: TimeRange): Scalar
  tweenPoints(time: Time, range: TimeRange): PointTuple 
  tweenRects(time: Time, range: TimeRange): RectTuple
  tweenSizes(time: Time, range: TimeRange): SizeTuple 
  tweenValues(key: string, time: Time, range: TimeRange): Scalar[] 
}

export const isTweenable = (value?: any): value is Tweenable => {
  return isDefinition(value.definition)
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
