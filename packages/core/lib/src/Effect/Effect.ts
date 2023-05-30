
import type { Identified, Size } from '@moviemasher/runtime-shared'
import type { Rect } from '@moviemasher/runtime-shared'
import type { CommandFiles, CommandFilterArgs, CommandFilters, VisibleCommandFileArgs } from '../Base/Code.js'
import type { Time, TimeRange } from '@moviemasher/runtime-shared'
import type { SvgFilters } from '../Helpers/Svg/Svg.js'
import type { Filter, FilterDefinitionObject } from '../Plugin/Filter/Filter.js'
import type { PropertyObject } from '@moviemasher/runtime-shared'

import type { EffectType } from '../Setup/Enums.js'
import { TypeEffect } from "../Setup/EnumConstantsAndFunctions.js"
import { isTyped } from '../Base/TypedFunctions.js'
import { Strings } from '@moviemasher/runtime-shared'
import { Labeled } from '../Base/Base.js'
import { Selectable } from '../Plugin/Masher/Selectable.js'

export interface Effect extends Identified, Labeled { //extends Clipable {
  definition : EffectMedia
  assetIds: Strings

}

export interface ClientEffect extends Effect, Selectable {
  svgFilters(previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SvgFilters

}  
export type ClientEffects = ClientEffect[]

export interface ServerEffect extends Effect {
  commandFilters(args: CommandFilterArgs): CommandFilters
  commandFiles(args: VisibleCommandFileArgs): CommandFiles
}
export const isEffect = (value?: any): value is Effect => {
  return isTyped(value) && value.type === TypeEffect
}
export function assertEffect(value?: any): asserts value is Effect {
  if (!isEffect(value)) throw new Error('expected Effect')
}
export type Effects = Effect[]

export interface EffectObject extends Labeled {
  id: string
}// extends ClipableObject {}
export type EffectObjects = EffectObject[]


export interface EffectMediaObject extends Identified, Labeled {//} extends ClipableMediaObject {
  initializeFilter?: FilterDefinitionObject
  finalizeFilter?: FilterDefinitionObject
  filters? : FilterDefinitionObject[]
  properties? : PropertyObject[]
}

/**
 * @category Media
 */
export interface EffectMedia extends Identified, Labeled { //extends ClipableMedia {
  assetIds: Strings
  type: EffectType
  instanceFromObject(object?: EffectObject) : Effect
  filters: Filter[]
}

export const isEffectMedia = (value?: any): value is EffectMedia => {
  return isTyped(value) && value.type === TypeEffect
}

