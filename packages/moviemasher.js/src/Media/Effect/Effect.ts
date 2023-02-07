import { isMedia } from "../Media"
import { DefinitionType } from "../../Setup/Enums"

import { PreloadableDefinition, PreloadableDefinitionObject, PreloadableObject } from "../../Mixin/Preloadable/Preloadable"
import { isTweenable, Tweenable, TweenableDefinition, TweenableDefinitionObject, TweenableObject } from "../../Mixin/Tweenable/Tweenable"
import { CommandFiles, CommandFilterArgs, CommandFilters, VisibleCommandFileArgs } from "../../MoveMe"
import { Size } from "../../Utility/Size"
import { Rect } from "../../Utility/Rect"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { SvgFilters } from "../../declarations"
import { Filter, FilterDefinitionObject } from "../../Filter/Filter"
import { PropertyObject } from "../../Setup/Property"


export interface EffectObject extends TweenableObject, PreloadableObject {
  id?: string
}

export interface Effect extends Tweenable {
  definition : EffectDefinition
  svgFilters(previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SvgFilters
  commandFilters(args: CommandFilterArgs): CommandFilters
  commandFiles(args: VisibleCommandFileArgs): CommandFiles
}

export const isEffect = (value?: any): value is Effect => {
  return isTweenable(value) && value.type === DefinitionType.Effect
}
export function assertEffect(value?: any): asserts value is Effect {
  if (!isEffect(value)) throw new Error("expected Effect")
}

export type Effects = Effect[]

export interface EffectDefinitionObject extends TweenableDefinitionObject, PreloadableDefinitionObject {
  initializeFilter?: FilterDefinitionObject
  finalizeFilter?: FilterDefinitionObject
  filters? : FilterDefinitionObject[]
  properties? : PropertyObject[]
}

export interface EffectDefinition extends TweenableDefinition, PreloadableDefinition {
  instanceFromObject(object?: EffectObject) : Effect
  filters: Filter[]
}

export const isEffectDefinition = (value?: any): value is EffectDefinition => {
  return isMedia(value) && value.type === DefinitionType.Effect
}

