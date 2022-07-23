import { Constrained, Scalar} from "../../declarations"
import { Definition, DefinitionObject, isDefinition } from "../../Definition/Definition"
import { Actions } from "../../Editor/Actions/Actions"
import { Filter } from "../../Filter/Filter"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Instance, InstanceObject } from "../../Instance/Instance"
import { CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, GraphFileArgs, GraphFiles, SelectedProperties } from "../../MoveMe"
import { Orientation, SelectType } from "../../Setup/Enums"
import { PointTuple } from "../../Utility/Point"
import { Rect, RectTuple } from "../../Utility/Rect"
import { Size, SizeTuple } from "../../Utility/Size"

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
}

export interface TweenableDefinitionObject extends DefinitionObject {}

export interface Tweenable extends Instance { 

  alphamergeCommandFilters(args: CommandFilterArgs): CommandFilters
  alphamergeFilter: Filter
  amixCommandFilters(args: CommandFilterArgs): CommandFilters
  canColor(args: CommandFilterArgs): boolean
  canColorTween(args: CommandFilterArgs): boolean
  colorBackCommandFilters(args: CommandFilterArgs, output?: string): CommandFilters
  colorCommandFilters(args: CommandFilterArgs): CommandFilters
  colorFilter: Filter  
  commandFiles(args: CommandFileArgs): CommandFiles 
  commandFilters(args: CommandFilterArgs): CommandFilters 
  containerColorCommandFilters(args: CommandFilterArgs): CommandFilters
  containerCommandFilters(args: CommandFilterArgs): CommandFilters 
  contentCommandFilters(args: CommandFilterArgs): CommandFilters 
  copyCommandFilter(input: string, track: number, prefix?: string): CommandFilter
  cropFilter: Filter
  finalCommandFilters(args: CommandFilterArgs): CommandFilters 
  graphFiles(args: GraphFileArgs): GraphFiles
  initialCommandFilters(args: CommandFilterArgs): CommandFilters
  intrinsicRect: Rect
  intrinsicSizeInitialize(): Rect
  intrinsicsKnown: boolean
  lock: Orientation
  mergeCommandFilters(args: CommandFilterArgs): CommandFilters
  offE: boolean
  offN: boolean
  offS: boolean
  offW: boolean
  overlayFilter: Filter
  scaleCommandFilters(args: CommandFilterArgs): CommandFilters 
  selectedProperties(actions: Actions, selectType: SelectType): SelectedProperties
  setptsFilter: Filter
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
