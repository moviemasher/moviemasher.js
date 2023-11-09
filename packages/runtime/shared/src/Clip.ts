import type { Asset, AssetObject } from './AssetTypes.js'
import type { InstanceCacheArgs } from './CacheTypes.js'
import type { ClipObject } from './ClipObject.js'
import type { ContainerRectArgs } from './Container.js'
import type { Strings } from './Core.js'
import type { DataOrError } from './DataOrError.js'
import type { Instance, VisibleInstance } from './InstanceTypes.js'
import type { Propertied } from './Propertied.js'
import type { RectTuple } from './Rect.js'
import type { Sizing } from './Sizing.js'
import type { TimeRange } from './Time.js'
import type { Timing } from './Timing.js'
import type { Track } from './Track.js'

export interface Clip extends Propertied {
  asset(assetIdOrObject: string | AssetObject): Asset 
  assetIds: Strings
  audible: boolean
  clipCachePromise(args: InstanceCacheArgs): Promise<DataOrError<number>>
  clipObject: ClipObject
  container?: VisibleInstance
  containerId: string
  content: Instance
  contentId: string
  endFrame: number
  frame : number
  frames: number
  id: string
  intrinsicsKnown(options: IntrinsicOptions): boolean
  label: string
  maxFrames(quantize : number, trim? : number) : number
  mutable: boolean
  muted: boolean
  notMuted: boolean
  containerRects(args: ContainerRectArgs): RectTuple
  resetTiming(instance?: Instance, quantize?: number): void
  sizing: Sizing
  timeRange: TimeRange
  timing: Timing
  track: Track
  trackNumber: number
  visible : boolean
}

export interface Clips extends Array<Clip>{}

export interface IntrinsicOptions {
  editing?: boolean
  size?: boolean
  duration?: boolean
}
