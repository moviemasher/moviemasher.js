import type { Asset } from './AssetTypes.js'
import type { Labeled } from './Base.js'
import type { InstanceCacheArgs } from './CacheTypes.js'
import type { Clip, IntrinsicOptions } from './Clip.js'
import type { ContainerRectArgs } from './Container.js'
import type { ContentRectArgs } from "./ContentRectArgs.js"
import type { Numbers, Scalars, Strings, Value } from './Core.js'
import type { Directions, SideDirectionRecord } from './Direction.js'
import type { Identified } from './Identified.js'
import type { Propertied } from './Propertied.js'
import type { Rect, Rects } from './Rect.js'
import type { PropertySize } from './Size.js'
import type { Time, TimeRange } from './Time.js'
import type { Lock } from './Lock.js'
import { DataOrError } from './DataOrError.js'


export interface Instance extends Propertied, Identified {
  asset: Asset
  assetId: string
  assetIds: Strings
  clip: Clip
  clipped: boolean
  container: boolean
  containerRects(args: ContainerRectArgs, inRect: Rect): Rects
  contentRects(args: ContentRectArgs): Rects 
  assetTime(masherTime: Time): Time
  sideDirectionRecord: SideDirectionRecord
  directions: Directions
  frames(quantize: number): number 
  hasIntrinsicSizing: boolean
  hasIntrinsicTiming: boolean
  height: number
  instanceCachePromise(args: InstanceCacheArgs): Promise<DataOrError<number>>
  instanceObject: InstanceObject
  intrinsicRect(editing?: boolean): Rect
  intrinsicsKnown(options: IntrinsicOptions): boolean
  isDefault: boolean
  isDefaultOrAudio: boolean
  lock: Lock
  mutable(): boolean
  muted: boolean
  leftConstrain: boolean
  rightConstrain: boolean
  topConstrain: boolean
  bottomConstrain: boolean
  pointAspect: string
  sizeAspect: string
  opacity: number
  opacityEnd?: number
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

  opacity?: number
  opacityEnd?: number
  width?: number
  widthEnd?: number
  pointAspect?: string
  sizeAspect?: string
  
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
  itemContentRect(containerRect: Rect, shortest: PropertySize, time: Time): Rect
}

export interface VisibleInstanceObject extends InstanceObject {}
