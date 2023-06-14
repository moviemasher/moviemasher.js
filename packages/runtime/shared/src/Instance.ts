import type { Asset } from './AssetTypes.js'
import type { Labeled } from './Base.js'
import type { InstanceCacheArgs } from './CacheTypes.js'
import type { Clip, IntrinsicOptions } from './Clip.js'
import type { ContainerRectArgs } from './Container.js'
import type { ContentRectArgs } from "./ContentRectArgs.js"
import type { Numbers, Scalar, Scalars, Strings, Value } from './Core.js'
import type { Direction, SideDirectionObject } from './Direction.js'
import type { Identified } from './Identified.js'
import type { PointTuple } from './Point.js'
import type { Propertied } from './Propertied.js'
import type { Rect, RectTuple } from './Rect.js'
import type { SizeTuple } from './Size.js'
import type { Time, TimeRange } from './Time.js'
import type { Lock } from './Lock.js'


export interface Instance extends Propertied, Identified {
  asset: Asset
  assetId: string
  assetIds: Strings
  clip: Clip
  clipped: boolean
  container: boolean
  containerRects(args: ContainerRectArgs, inRect: Rect): RectTuple
  contentRects(args: ContentRectArgs): RectTuple 
  assetTime(masherTime: Time): Time
  directionObject: SideDirectionObject
  directions: Direction[]
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
  tween(keyPrefix: string, time: Time, range: TimeRange): Scalar
  tweenPoints(time: Time, range: TimeRange): PointTuple 
  tweenRects(time: Time, range: TimeRange): RectTuple
  tweenSizes(time: Time, range: TimeRange): SizeTuple 
  tweenValues(key: string, time: Time, range: TimeRange): Scalars 
  width: number
  x: number
  y: number
}

export interface InstanceObject extends Labeled {
  assetId?: string
  x?: number
  xEnd?: number
  y?: number
  yEnd?: number
  lock?: string
  container?: boolean

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

export interface AudibleInstance extends Instance, AudibleInstanceProperties {}

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
