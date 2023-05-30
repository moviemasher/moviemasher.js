import type { Propertied } from '@moviemasher/runtime-shared'
import type { Asset } from '../Asset/Asset.js'
import type { Clip, IntrinsicOptions } from '../Mash/Clip/Clip.js'
import type { Filter } from '../../Plugin/Filter/Filter.js'
import type { Time, TimeRange } from '@moviemasher/runtime-shared'
import type { Rect, RectTuple } from '@moviemasher/runtime-shared'
import type { PointTuple } from '@moviemasher/runtime-shared'
import type { SizeTuple } from '@moviemasher/runtime-shared'
import type { Numbers, Scalar, Scalars, Strings, Value } from '@moviemasher/runtime-shared'
import type { Identified } from '@moviemasher/runtime-shared'
import type { Lock } from '@moviemasher/runtime-shared'
import type { ContentRectArgs } from "../../Helpers/Content/ContentRectArgs.js"
import type { EffectObjects, Effects } from '../../Effect/Effect.js'
import type { Direction, SideDirectionObject } from '../../Setup/Direction.js'
import type { ContainerRectArgs } from '../../Helpers/Container/Container.js'
import { InstanceCacheArgs } from '../../Base/Code.js'


export interface Instance extends Propertied, Identified {
  asset: Asset
  assetId: string
  assetIds: Strings
  clip: Clip
  clipped: boolean
  colorFilter: Filter  
  container: boolean
  containerRects(args: ContainerRectArgs, inRect: Rect): RectTuple
  contentRects(args: ContentRectArgs): RectTuple 
  cropFilter: Filter
  assetTime(masherTime: Time): Time
  directionObject: SideDirectionObject
  directions: Direction[]
  effects: Effects
  frames(quantize: number): number 
  hasIntrinsicSizing: boolean
  hasIntrinsicTiming: boolean
  height: number
  instanceCachePromise(args: InstanceCacheArgs): Promise<void>
  intrinsicRect(editing?: boolean): Rect
  intrinsicsKnown(options: IntrinsicOptions): boolean
  isDefault: boolean
  isDefaultOrAudio: boolean
  lock: Lock
  mutable(): boolean
  muted: boolean
  offE: boolean
  offN: boolean
  offS: boolean
  offW: boolean
  opacity: number
  opacityEnd?: number
  overlayFilter: Filter
  opacityFilter: Filter
  tween(keyPrefix: string, time: Time, range: TimeRange): Scalar
  tweenPoints(time: Time, range: TimeRange): PointTuple 
  tweenRects(time: Time, range: TimeRange): RectTuple
  tweenSizes(time: Time, range: TimeRange): SizeTuple 
  tweenValues(key: string, time: Time, range: TimeRange): Scalars 
  width: number
  x: number
  y: number
}

export interface InstanceObject  {
  label?: string
  assetId?: string
  x?: number
  xEnd?: number
  y?: number
  yEnd?: number
  lock?: string
  container?: boolean
  effects?: EffectObjects

  height?: number
  heightEnd?: number
  offN?: boolean
  offS?: boolean
  offE?: boolean
  offW?: boolean
  opacity?: number
  opacityEnd?: number
  width?: number
  widthEnd?: number
  
}

export interface InstanceArgs extends InstanceObject {
  asset: Asset
}

interface AudibleInstanceProperties {
  gain: number
  gainPairs: Numbers[]
  speed: number
  startTrim: number
  endTrim: number
}

export interface AudibleInstance extends Instance, AudibleInstanceProperties {
  
}

export interface AudibleInstanceObject extends InstanceObject {
  gain?: Value
  muted?: boolean
  loops?: number
  speed?: number
  startTrim?: number
  endTrim?: number
}

export interface VisibleInstance extends Instance {
  itemContentRect(containerRect: Rect, time: Time): Rect
}

export interface VisibleInstanceObject extends InstanceObject {}
