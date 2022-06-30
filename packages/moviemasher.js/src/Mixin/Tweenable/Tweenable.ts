import { Constrained, Scalar} from "../../declarations"
import { Definition, DefinitionObject, isDefinition } from "../../Definition/Definition"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Instance, InstanceObject } from "../../Instance/Instance"
import { GraphFileArgs, GraphFiles } from "../../MoveMe"
import { LoadType } from "../../Setup/Enums"

export interface TweenableObject extends InstanceObject {
  container?: boolean
  content?: boolean
  x?: number
  xEnd?: number
  y?: number
  yEnd?: number
}

export interface TweenableDefinitionObject extends DefinitionObject {}

export interface Tweenable extends Instance { 
  tween(keyPrefix: string, time: Time, range: TimeRange): Scalar
  tweenValues(key: string, time: Time, range: TimeRange): Scalar[] 

  constrainWidth: boolean

  constrainHeight: boolean


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
  return isDefinition(value) && "preloadableSource" in value
}

export function assertTweenableDefinition(value?: any): asserts value is TweenableDefinition {
  if (!isTweenableDefinition(value)) throw new Error('expected TweenableDefinition')
}

export type TweenableClass = Constrained<Tweenable>
export type TweenableDefinitionClass = Constrained<TweenableDefinition>
