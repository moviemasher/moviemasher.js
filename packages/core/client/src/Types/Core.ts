

import type { Identified, Labeled } from '@moviemasher/lib-core'

export enum ActivityType {
  Analyze = 'analyze',
  Complete = 'complete',
  Error = "error",
  Load = 'load',
  Render = 'render',
}

export interface ActivityInfo extends Identified, Labeled {
  type: ActivityType
  steps?: number
  step?: number
  error?: string
  value?: string
}

export interface WithIcon {
  icon?: string
}