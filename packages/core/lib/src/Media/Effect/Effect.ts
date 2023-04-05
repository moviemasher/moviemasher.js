
import type { Size } from '../../Utility/Size.js'
import type { Rect } from '../../Utility/Rect.js'
import type { CommandFiles, CommandFilterArgs, CommandFilters, VisibleCommandFileArgs } from '../../Base/Code.js'
import type { Tweenable, TweenableDefinition, TweenableDefinitionObject, TweenableObject } from '../../Mixin/Tweenable/Tweenable.js'
import type { Time, TimeRange } from '../../Helpers/Time/Time.js'
import type { SvgFilters } from '../../Helpers/Svg/Svg.js'
import type { Filter, FilterDefinitionObject } from '../../Plugin/Filter/Filter.js'
import type { PropertyObject } from '../../Setup/Property.js'

import type { EffectType } from '../../Setup/Enums.js'
import { TypeEffect } from '../../Setup/Enums.js'
import { isTweenable } from '../../Mixin/Tweenable/TweenableFunctions.js'
import { isMedia } from '../MediaFunctions.js'

export interface Effect extends Tweenable {
  definition : EffectMedia
  svgFilters(previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SvgFilters
  commandFilters(args: CommandFilterArgs): CommandFilters
  commandFiles(args: VisibleCommandFileArgs): CommandFiles
}
export const isEffect = (value?: any): value is Effect => {
  return isTweenable(value) && value.type === TypeEffect
}
export function assertEffect(value?: any): asserts value is Effect {
  if (!isEffect(value)) throw new Error('expected Effect')
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
  return isMedia(value) && value.type === TypeEffect
}

