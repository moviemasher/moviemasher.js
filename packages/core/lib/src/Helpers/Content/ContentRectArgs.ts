import type { Rect, RectTuple, Time, TimeRange } from '@moviemasher/runtime-shared'


export interface ContentRectArgs {
  containerRects: Rect | RectTuple
  editing?: boolean
  loading?: boolean
  time: Time
  timeRange: TimeRange
}
