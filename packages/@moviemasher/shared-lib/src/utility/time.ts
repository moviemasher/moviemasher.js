import type { NumberTuple, Numbers, Rounding, Strings, Time, TimeRange } from '../types.js'
import type { TimeRanges, Times } from '../types.js'

import { assertAboveZero, assertInteger, assertPositive, assertTrue } from './guards.js'
import { COLON, roundWithMethod } from '../runtime.js'
import { errorThrow, ERROR } from '../runtime.js'
import { isObject } from './guard.js'
import { arrayOfNumbers } from '../runtime.js'


export class TimeClass implements Time {
  constructor(public frame: number = 0, public fps: number = 1) {}

  closest(timeRange: TimeRange): Time {
    const frame = timeRange.frame + Math.round(timeRange.frames / 2)
    const halfTime = new TimeClass(frame, timeRange.fps)
    const [midTime, editorTime] = timeEqualizeRates(halfTime, this)
    const shouldBeOnLast = midTime.frame < editorTime.frame
    return shouldBeOnLast ? timeRange.lastTime: timeRange.startTime
  }
  
  get copy(): Time { return new TimeClass(this.frame, this.fps) }

  get description(): string { return `${this.frame}@${this.fps}` }

  durationFrames(duration: number, fps = 0): Numbers {
    const rate = fps || this.fps
    const framesMax  = Math.floor(rate * duration) - 2 
    const startFrame = Math.min(framesMax, this.scale(rate, 'floor').frame)
    const frames: Numbers = []
    if (this.isRange) {
      const scaledFrame = this.timeRange.endTime.scale(rate, 'ceil').frame
      const endFrame = Math.min(framesMax + 1, scaledFrame)
      frames.push(...arrayOfNumbers(endFrame - startFrame, startFrame))
    } else frames.push(startFrame)
    return frames
  }

  equalsTime(time: Time): boolean {
    const [time1, time2] = timeEqualizeRates(this, time)
    return time1.frame === time2.frame
  }

  isRange = false

  get lengthSeconds(): number { return 0 }

  min(time: Time): Time {
    const [time1, time2] = timeEqualizeRates(this, time)
    return new TimeClass(Math.min(time1.frame, time2.frame), time1.fps)
  }

  scale(fps: number, rounding?: Rounding): Time {
    if (this.fps === fps) return this

    const frame = (this.frame / this.fps) * fps
    return new TimeClass(roundWithMethod(frame, rounding), fps)
  }

  scaleToFps(fps: number): Time { 
    return timeEqualizeRates(this, new TimeClass(0, fps))[0]
  }

  get seconds(): number { return Number(this.frame) / Number(this.fps) }

  get startTime(): Time { return this }

  get timeRange(): TimeRange { return errorThrow(ERROR.Unimplemented) }

  toString(): string { return `[${this.description}]` }

  withFrame(frame: number): Time {
    const time = this.copy
    time.frame = frame
    return time
  }
}

export class TimeRangeClass extends TimeClass implements TimeRange {
  constructor(public frame = 0, public fps = 1, public frames = 1) {
    super(frame, fps)
  }

  get copy(): TimeRange {
    return new TimeRangeClass(this.frame, this.fps, this.frames)
  }

  get description(): string { return `${this.frame}-${this.frames}@${this.fps}` }

  get end(): number { return this.frame + this.frames }

  get endTime(): Time { return new TimeClass(this.end, this.fps) }

  get frameTimes(): Times {
    const { frames, frame, fps } = this
    return Array.from({ length: frames }, (_, i) => new TimeClass(frame + i, fps))
  }

  includes(frame: number): boolean {
    return frame >= this.frame && frame < this.end
  }

  private includesTime(time: Time): boolean {
    const [thisTime, scaledTime] = timeEqualizeRates(this, time)
    const thisRange = thisTime as TimeRange
    const { frame, end } = thisRange
    const other = scaledTime.frame
    return other >= frame && other < end
  }

  intersection(time: Time): TimeRange | undefined {
    const range = time.isRange ? time.timeRange: new TimeRangeClass(time.frame, time.fps)

    const [range1, range2] = timeEqualizeRates(range, this) as TimeRanges

    const { frame: frame1, end: end1, fps } = range1
    const { frame: frame2, end: end2 } = range2

    const frameMax = Math.max(frame1, frame2)
    const endMin = Math.min(end1, end2)
    return new TimeRangeClass(frameMax, fps, endMin - frameMax)
  }

  intersects(time: Time): boolean {
    if (!time.isRange) return this.includesTime(time)

    const [range1, range2] = timeEqualizeRates(time, this) as TimeRanges
    if (range1.frame >= range2.end) return false

    return range1.end > range2.frame
  }

  isRange = true

  get last(): number { return this.frame + this.frames - 1 }

  get lastTime(): Time { return new TimeClass(this.last, this.fps) }

  get lengthSeconds(): number { return Number(this.frames) / Number(this.fps) }

  get position(): number { return Number(this.frame) / Number(this.frames) }

  positionTime(position: number, rounding?: Rounding): Time {
    const frame = roundWithMethod((this.frames - this.frame) * position, rounding)
    return new TimeClass(this.frame + frame, this.fps)
  }

  get startTime(): Time { return new TimeClass(this.frame, this.fps) }

  scale(fps = 1, rounding?: Rounding): TimeRange {
    if (this.fps === fps) return this.copy

    const value = Number(this.frames) / (Number(this.fps) / Number(fps))
    const time = super.scale(fps, rounding)
    const frames = Math.max(1, roundWithMethod(value, rounding))
    return new TimeRangeClass(time.frame, time.fps, frames)
  }

  get timeRange(): TimeRange { return this }

  get times(): Times {
    const array = [this.startTime]
    if (this.frames > 1) array.push(this.endTime)
    return array
  }

  minEndTime(endTime: Time): TimeRange {
    const [range, time] = <TimeRange[]> timeEqualizeRates(this, endTime)
    range.frames = Math.min(range.frames, time.frame)
    return range
  }

  withFrame(frame: number): TimeRange {
    const range = this.copy
    range.frame = frame
    return range
  }

  withFrames(frames: number): TimeRange {
    const range = this.copy
    range.frames = frames
    return range
  }
}

const timeGreatestCommonDenominator = (fps1: number, fps2: number): number => {
  let a = fps1
  let b = fps2
  let t = 0
  while (b !== 0) {
    t = b
    b = a % b
    a = t
  }
  return a
}

const timeLowestCommonMultiplier = (a: number, b: number): number => (
  (a * b) / timeGreatestCommonDenominator(a, b)
)

const timeEqualizeRates = (time1: Time, time2: Time, rounding?: Rounding): Time[] => {
  if (time1.fps === time2.fps) return [time1, time2]

  const gcf = timeLowestCommonMultiplier(time1.fps, time2.fps)
  return [
    time1.scale(gcf, rounding),
    time2.scale(gcf, rounding)
  ]
}

export const timeRangeFromArgs = (frame = 0, fps = 1, frames = 1): TimeRange => {
  return new TimeRangeClass(frame, fps, frames)
}

export const timeRangeFromSeconds =(start = 0, duration = 1): TimeRange => {
  return timeRangeFromArgs(start, 1, duration)
}

export const timeRangeFromTime = (time: Time, frames = 1): TimeRange => {
  return timeRangeFromArgs(time.frame, time.fps, frames)
}

export const timeRangeFromTimes = (startTime: Time, endTime?: Time): TimeRange => {
  if (!endTime) return timeRangeFromTime(startTime)

  const [time1, time2] = <TimeRange[]> timeEqualizeRates(startTime, endTime)
  if (time2.frame <= time1.frame) errorThrow(ERROR.Frame)
  
  const frames = time2.frame - time1.frame
  return timeRangeFromArgs(time1.frame, time1.fps, frames)
}

export const timeFromArgs = (frame = 0, fps = 1): Time => {
  assertPositive(frame)
  assertInteger(fps)
  assertAboveZero(fps)  
  return new TimeClass(frame, fps)
}

export const timeFromSeconds = (seconds = 0, fps = 1, rounding?: Rounding): Time => {
  assertPositive(seconds)
  assertInteger(fps)
  assertAboveZero(fps)
  const rounded = roundWithMethod(seconds * fps, rounding)
  return timeFromArgs(rounded, fps)
}

export const stringSeconds = (seconds: number, fps = 0, lengthSeconds = 0, delimiter = '.'): string => {
  const addComponent = (bits: Strings, seconds: number, duration: number, time: number): number => {
    assertTrue(seconds <= duration)

    if (seconds < time) {
      if (duration > time) bits.push('00')
      return seconds
    }
    bits.push(String(Math.floor(seconds / time)).padStart(2, '0'))
    return seconds % time
  }
  const duration = lengthSeconds || seconds
  const bits: Strings = []
  let remainder = addComponent(bits, seconds, duration, 60 * 60)
  remainder = addComponent(bits, remainder, duration, 60)
  remainder = addComponent(bits, remainder, duration, 1)
  const bobs = [bits.join(COLON) || '0']
  if (fps > 1) {
    const pad = fps > 10 ? 2: 1
    if (remainder) {
      bobs.push(String(Math.round(remainder * Math.pow(10, pad))).padEnd(pad, '0'))
    } else bobs.push('0'.repeat(pad))
  } 
  return bobs.join(delimiter)
}

export const isTime = (value: any): value is Time => {
  return isObject(value) && 'isRange' in value
}

export function assertTime(value: any, name?: string): asserts value is Time {
  if (!isTime(value))
    errorThrow(value, 'Time', name)
}

export const isTimeRange = (value: any): value is TimeRange => {
  return isTime(value) && value.isRange
}

export function assertTimeRange(value: any, name?: string): asserts value is TimeRange {
  if (!isTimeRange(value))
    errorThrow(value, 'TimeRange', name)
}


export const offsetLength = (time: Time, range: TimeRange): NumberTuple => {
  const { seconds: rangeSeconds, lengthSeconds } = range
  const { seconds: timeSeconds } = time
  const offset = timeSeconds - rangeSeconds
  return [offset, lengthSeconds]
}
