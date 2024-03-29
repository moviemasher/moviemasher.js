export interface Time {
  add(time: Time): Time
  closest(timeRange: TimeRange): Time
  copy: Time
  divide(number: number, rounding?: string): Time
  equalsTime(time: Time): boolean
  fps: number
  frame: number
  durationFrames(duration: number, fps?: number): number[]
  lengthSeconds: number
  isRange: boolean
  min(time: Time): Time
  scale(fps: number, rounding?: string): Time
  scaleToFps(fps: number): Time
  seconds: number
  startTime: Time
  timeRange: TimeRange
  withFrame(frame: number): Time
}

export interface TimeRange extends Time {
  copy: TimeRange
  end: number
  endTime: Time
  frames: number
  includes(frame: number): boolean
  intersects(time: Time): boolean
  last: number
  lastTime: Time
  position: number
  positionTime(position: number, rounding?: string): Time
  scale(fps: number, rounding?: string): TimeRange
  times: Times
  withFrame(frame: number): TimeRange
}

export type Times = Time[]
export type TimeRanges = TimeRange[]
