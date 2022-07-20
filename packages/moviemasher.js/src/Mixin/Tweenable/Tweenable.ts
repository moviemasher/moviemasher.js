import { Constrained, Scalar} from "../../declarations"
import { Definition, DefinitionObject, isDefinition } from "../../Definition/Definition"
import { Filter } from "../../Filter/Filter"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Instance, InstanceObject } from "../../Instance/Instance"
import { CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { PointTuple } from "../../Utility/Point"
import { RectTuple } from "../../Utility/Rect"
import { SizeTuple } from "../../Utility/Size"

export interface TweenableObject extends InstanceObject {
  container?: boolean
  content?: boolean
  x?: number
  xEnd?: number
  y?: number
  yEnd?: number
  constrainX?: boolean
  constrainY?: boolean
}

export interface TweenableDefinitionObject extends DefinitionObject {}

export interface Tweenable extends Instance { 
  commandFiles(args: CommandFileArgs): CommandFiles 
  colorCommandFilters(args: CommandFilterArgs): CommandFilters
  copyCommandFilter(input: string, track: number, prefix?: string): CommandFilter
  alphamergeCommandFilters(args: CommandFilterArgs): CommandFilters
  colorFilter: Filter  
  alphamergeFilter: Filter
  mergeCommandFilters(args: CommandFilterArgs): CommandFilters
  canColor(args: CommandFilterArgs): boolean
  canColorTween(args: CommandFilterArgs): boolean
  
  colorBackCommandFilters(args: CommandFilterArgs, output?: string): CommandFilters
  cropFilter: Filter
  overlayFilter: Filter
  finalCommandFilters(args: CommandFilterArgs): CommandFilters 
  setptsFilter: Filter
  containerColorCommandFilters(args: CommandFilterArgs): CommandFilters
  scaleCommandFilters(args: CommandFilterArgs): CommandFilters 
  initialCommandFilters(args: CommandFilterArgs): CommandFilters
  commandFilters(args: CommandFilterArgs): CommandFilters 
  contentCommandFilters(args: CommandFilterArgs): CommandFilters 
  containerCommandFilters(args: CommandFilterArgs): CommandFilters 
  amixCommandFilters(args: CommandFilterArgs): CommandFilters
  constrainX: boolean
  constrainY: boolean
  graphFiles(args: GraphFileArgs): GraphFiles
  tween(keyPrefix: string, time: Time, range: TimeRange): Scalar
  tweenValues(key: string, time: Time, range: TimeRange): Scalar[] 
  tweenPoints(time: Time, range: TimeRange): PointTuple 
  tweenSizes(time: Time, range: TimeRange): SizeTuple 
  tweenRects(time: Time, range: TimeRange): RectTuple
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
