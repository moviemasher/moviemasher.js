import type { Rect, RectTuple } from './Rect.js'
import type { Time, TimeRange } from './Time.js'

export interface ContentRectArgs {
  containerRects: Rect | RectTuple
  editing?: boolean
  loading?: boolean
  time: Time
  timeRange: TimeRange
}
