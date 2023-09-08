import type { InstanceCacheArgs } from './CacheTypes.js'
import type { ClipObject } from './ClipObject.js'
import type { ContainerRectArgs } from './Container.js'
import type { Strings } from './Core.js'
import type { Instance, VisibleInstance } from './InstanceTypes.js'
import type { Propertied } from './Propertied.js'
import type { Rects } from './Rect.js'
import type { Sizing } from './Sizing.js'
import type { TimeRange } from './Time.js'
import type { Timing } from './Timing.js'
import type { Track } from './Track.js'

export interface Clip extends Propertied {
  assetIds: Strings
  audible: boolean
  clipCachePromise(args: InstanceCacheArgs): Promise<void>
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
  containerRects(args: ContainerRectArgs): Rects
  resetTiming(instance?: Instance, quantize?: number): void
  sizing: Sizing
  timeRange: TimeRange
  timing: Timing
  track: Track
  trackNumber: number
  visible : boolean
}

export type Clips = Clip[]

export interface IntrinsicOptions {
  editing?: boolean
  size?: boolean
  duration?: boolean
}
