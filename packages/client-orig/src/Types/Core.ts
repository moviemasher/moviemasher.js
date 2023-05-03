

import type { Identified, Labeled } from '@moviemasher/lib-core'
import type { Numbers } from '@moviemasher/lib-core'

export interface WithIcon {
  icon?: string
}
export interface WithClassName { 
  className?: string
}

export type SliderChangeHandler = (value: string | number | Numbers) => void

export type AnalyzeActivityType = 'analyze'
export type CompleteActivityType = 'complete'
export type ErrorActivityType = 'error'
export type LoadActivityType = 'load'
export type RenderActivityType = 'render'

export type ActivityType = AnalyzeActivityType | CompleteActivityType | ErrorActivityType | LoadActivityType | RenderActivityType

export const ActivityTypeAnalyze: ActivityType = 'analyze'
export const ActivityTypeComplete: ActivityType = 'complete'
export const ActivityTypeError: ActivityType = 'error'
export const ActivityTypeLoad: ActivityType = 'load'
export const ActivityTypeRender: ActivityType = 'render'

export interface ActivityInfo extends Identified, Labeled {
  type: ActivityType
  steps?: number
  step?: number
  error?: string
  value?: string
}

