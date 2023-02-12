import { isMedia, MediaObject } from "../Media"
import { EffectType } from "../../Setup/Enums"

import { PreloadableDefinition } from "../../Mixin/Preloadable/Preloadable"
import { isTweenable, Tweenable, TweenableDefinition, TweenableDefinitionObject, TweenableObject } from "../../Mixin/Tweenable/Tweenable"
import { CommandFiles, CommandFilterArgs, CommandFilters, VisibleCommandFileArgs } from "../../Base/Code"
import { Size } from "../../Utility/Size"
import { Rect } from "../../Utility/Rect"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { SvgFilters } from "../../Helpers/Svg/Svg"
import { Filter, FilterDefinitionObject } from "../../Filter/Filter"
import { PropertyObject } from "../../Setup/Property"
import { MediaInstanceObject } from "../MediaInstance/MediaInstance"


export interface EffectObject extends TweenableObject, MediaInstanceObject {
  
}

export interface Effect extends Tweenable {
  definition : EffectDefinition
  svgFilters(previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SvgFilters
  commandFilters(args: CommandFilterArgs): CommandFilters
  commandFiles(args: VisibleCommandFileArgs): CommandFiles
}

export const isEffect = (value?: any): value is Effect => {
  return isTweenable(value) && value.type === EffectType
}
export function assertEffect(value?: any): asserts value is Effect {
  if (!isEffect(value)) throw new Error("expected Effect")
}

export type Effects = Effect[]

export interface EffectDefinitionObject extends TweenableDefinitionObject, MediaObject {
  initializeFilter?: FilterDefinitionObject
  finalizeFilter?: FilterDefinitionObject
  filters? : FilterDefinitionObject[]
  properties? : PropertyObject[]
}

export interface EffectDefinition extends TweenableDefinition, PreloadableDefinition {
  type: EffectType
  instanceFromObject(object?: EffectObject) : Effect
  filters: Filter[]
}

export const isEffectDefinition = (value?: any): value is EffectDefinition => {
  return isMedia(value) && value.type === EffectType
}

