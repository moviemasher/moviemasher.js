import type { 
  Propertied, RectTuple, Strings, Time, TimeRange 
} from '@moviemasher/runtime-shared'

import type { ContainerRectArgs } from '../../../Helpers/Container/Container.js'
import type { Instance, VisibleInstance } from '../../Instance/Instance.js'
import type { Sizing } from '../../../Setup/Sizing.js'
import type { Timing } from '../../../Setup/Timing.js'
import type { Track } from '../Track/Track.js'

export interface Clip extends Propertied {
  audible: boolean
  container?: VisibleInstance
  containerId: string
  content: Instance
  contentId: string
  assetIds: Strings
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
  rects(args: ContainerRectArgs): RectTuple
  resetTiming(tweenable?: Instance, quantize?: number): void
  sizing: Sizing
  timeRange: TimeRange
  timeRangeRelative(mashTime : TimeRange, quantize : number) : TimeRange
  timing: Timing
  track: Track
  trackNumber: number
  visible : boolean
}

export interface IntrinsicOptions {
  editing?: boolean
  size?: boolean
  duration?: boolean
}

export type Clips = Clip[]
