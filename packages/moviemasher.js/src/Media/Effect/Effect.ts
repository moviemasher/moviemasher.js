import { isMedia, Media, MediaObject } from "../Media"
import { EffectType } from "../../Setup/Enums"

import { isTweenable, Tweenable, TweenableDefinition, TweenableDefinitionObject, TweenableObject } from "../../Mixin/Tweenable/Tweenable"
import { CommandFiles, CommandFilterArgs, CommandFilters, VisibleCommandFileArgs } from "../../Base/Code"
import { Size } from "../../Utility/Size"
import { Rect } from "../../Utility/Rect"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { SvgFilters } from "../../Helpers/Svg/Svg"
import { Filter, FilterDefinitionObject } from "../../Plugin/Filter/Filter"
import { PropertyObject } from "../../Setup/Property"

export interface Effect extends Tweenable {
  definition : EffectMedia
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

export interface EffectObject extends TweenableObject {}


export interface EffectMediaObject extends TweenableDefinitionObject {
  initializeFilter?: FilterDefinitionObject
  finalizeFilter?: FilterDefinitionObject
  filters? : FilterDefinitionObject[]
  properties? : PropertyObject[]
}

/**
 * @category Media
 */
export interface EffectMedia extends TweenableDefinition {
  type: EffectType
  instanceFromObject(object?: EffectObject) : Effect
  filters: Filter[]
}

export const isEffectMedia = (value?: any): value is EffectMedia => {
  return isMedia(value) && value.type === EffectType
}

