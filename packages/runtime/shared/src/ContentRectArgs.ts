import type { Rects } from './Rect.js'
import { PropertySize } from './Size.js'
import type { Time, TimeRange } from './Time.js'

export interface ContentRectArgs {
  containerRects: Rects
  editing?: boolean
  loading?: boolean
  shortest: PropertySize
  time: Time
  timeRange: TimeRange
}
