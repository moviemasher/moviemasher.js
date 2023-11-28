import type { Numbers, Time, TimeRange } from '@moviemasher/runtime-shared'
import type { TimeRanges, Times } from '@moviemasher/runtime-shared'

import { assertAboveZero, assertInteger, assertPositive } from './guards.js'
import { COLON, roundWithMethod } from '@moviemasher/runtime-shared'
import { errorThrow, ERROR, isObject } from '@moviemasher/runtime-shared'
import { arrayOfNumbers } from '@moviemasher/runtime-shared'


export class TimeClass implements Time {
  constructor(frame = 0, fps = 1) {
    assertPositive(frame)
    assertInteger(frame)
    assertAboveZero(fps)

    this.frame = frame
    this.fps = fps
  }

  add(time : Time) : Time {
    const [time1, time2] = timeEqualizeRates(this, time)
    return new TimeClass(time1.frame + time2.frame, time1.fps)
  }

  addFrame(frames : number) : Time {
    const time = this.copy
    time.frame += frames
    return time
  }

  closest(timeRange: TimeRange): Time {
    const frame = timeRange.frame + Math.round(timeRange.frames / 2)
    const halfTime = new TimeClass(frame, timeRange.fps)
    const [midTime, editorTime] = timeEqualizeRates(halfTime, this)
    const shouldBeOnLast = midTime.frame < editorTime.frame
    return shouldBeOnLast ? timeRange.lastTime : timeRange.startTime
  }
  
  get copy() : Time { return new TimeClass(this.frame, this.fps) }

  get description() : string { return `${this.frame}@${this.fps}` }

  divide(number: number, rounding = '') : Time {
    assertAboveZero(number)

    if (number === 1.0) return this

    return this.withFrame(roundWithMethod(this.frame / number, rounding))
  }

  equalsTime(time : Time) : boolean {
    const [time1, time2] = timeEqualizeRates(this, time)
    return time1.frame === time2.frame
  }

  fps : number

  frame : number

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

  isRange = false

  get lengthSeconds(): number { return 0 }

  min(time : Time) : Time {
    const [time1, time2] = timeEqualizeRates(this, time)
    return new TimeClass(Math.min(time1.frame, time2.frame), time1.fps)
  }

  scale(fps : number, rounding = '') : Time {
    if (this.fps === fps) return this

    const frame = (Number(this.frame) / Number(this.fps)) * Number(fps)
    return new TimeClass(roundWithMethod(frame, rounding), fps)
  }

  scaleToFps(fps : number) : Time { return this.scaleToTime(new TimeClass(0, fps)) }

  scaleToTime(time : Time) : Time {
    return timeEqualizeRates(this, time)[0]
  }
  get seconds() : number { return Number(this.frame) / Number(this.fps) }

  get startTime(): Time { return this }

  subtract(time : Time) : Time {
    const [time1, time2] = timeEqualizeRates(this, time)

    let subtracted = time2.frame
    if (subtracted > time1.frame) {
      subtracted -= subtracted - time1.frame
    }
    return new TimeClass(time1.frame - subtracted, time1.fps)
  }

  subtractFrames(frames : number) : Time {
    const time = this.copy
    time.frame -= frames
    return time
  }

  get timeRange(): TimeRange { return errorThrow(ERROR.Internal) }

  toString() : string { return `[${this.description}]` }

  withFrame(frame : number) : Time {
    const time = this.copy
    time.frame = frame
    return time
  }
}

export class TimeRangeClass extends TimeClass implements TimeRange {
  constructor(frame = 0, fps = 1, frames = 1) {
    super(frame, fps)
    assertPositive(frames)
    assertInteger(frames)
  
    this.frames = frames
  }

  addFrames(frames : number) : TimeRange {
    const time = this.copy
    time.frames += frames
    return time
  }

  get copy() : TimeRange {
    return new TimeRangeClass(this.frame, this.fps, this.frames)
  }

  get description() : string { return `${this.frame}-${this.frames}@${this.fps}` }

  get end() : number { return this.frame + this.frames }

  get endTime() : Time { return new TimeClass(this.end, this.fps) }

  equalsTimeRange(timeRange : TimeRange) : boolean {
    const [range1, range2] = <TimeRange[]> timeEqualizeRates(this, timeRange)
    return range1.frame === range2.frame && range1.frames === range2.frames
  }

  get frameTimes(): Times {
    const { frames, frame, fps } = this
    return Array.from({ length: frames }, (_, i) => new TimeClass(frame, fps))
  }

  frames : number

  includes(frame: number): boolean {
    return frame >= this.frame && frame < this.end
  }

  includesTime(time : Time) : boolean {
    const [thisTime, scaledTime] = timeEqualizeRates(this, time)
    const thisRange = thisTime as TimeRange
    const { frame, end } = thisRange
    const other = scaledTime.frame
    return other >= frame && other < end
  }

  intersection(time: Time): TimeRange | undefined {
    const range = time.isRange ? time.timeRange : new TimeRangeClass(time.frame, time.fps)

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

  get last() : number { return this.frame + this.frames - 1 }

  get lastTime() : Time { return new TimeClass(this.last, this.fps) }

  get lengthSeconds() : number { return Number(this.frames) / Number(this.fps) }

  get position(): number { return Number(this.frame) / Number(this.frames) }

  positionTime(position: number, rounding = ''): Time {
    const frame = roundWithMethod((this.frames - this.frame) * position, rounding)
    return new TimeClass(this.frame + frame, this.fps)
  }

  get startTime() : Time { return new TimeClass(this.frame, this.fps) }

  scale(fps = 1, rounding = '') : TimeRange {
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

  minEndTime(endTime : Time) : TimeRange {
    const [range, time] = <TimeRange[]> timeEqualizeRates(this, endTime)
    range.frames = Math.min(range.frames, time.frame)
    return range
  }

  withFrame(frame : number) : TimeRange {
    const range = this.copy
    range.frame = frame
    return range
  }

  withFrames(frames : number) : TimeRange {
    const range = this.copy
    range.frames = frames
    return range
  }
}

const timeGreatestCommonDenominator = (fps1 : number, fps2 : number) : number => {
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

const timeLowestCommonMultiplier = (a : number, b : number) : number => (
  (a * b) / timeGreatestCommonDenominator(a, b)
)

const timeEqualizeRates = (time1 : Time, time2 : Time, rounding = '') : Time[] => {
  if (time1.fps === time2.fps) return [time1, time2]

  const gcf = timeLowestCommonMultiplier(time1.fps, time2.fps)
  return [
    time1.scale(gcf, rounding),
    time2.scale(gcf, rounding)
  ]
}

export const timeRangeFromArgs = (frame = 0, fps = 1, frames = 1) : TimeRange => {
  return new TimeRangeClass(frame, fps, frames)
}

export const timeRangeFromSeconds =(start = 0, duration = 1) : TimeRange => {
  return timeRangeFromArgs(start, 1, duration)
}

export const timeRangeFromTime = (time : Time, frames = 1) : TimeRange => {
  return timeRangeFromArgs(time.frame, time.fps, frames)
}

export const timeRangeFromTimes = (startTime: Time, endTime?: Time): TimeRange => {
  if (!endTime) return timeRangeFromTime(startTime)

  const [time1, time2] = <TimeRange[]> timeEqualizeRates(startTime, endTime)
  if (time2.frame <= time1.frame) return errorThrow(ERROR.Frame)
  
  const frames = time2.frame - time1.frame
  return timeRangeFromArgs(time1.frame, time1.fps, frames)
}

export const timeFromArgs = (frame = 0, fps = 1) : Time => {
  assertPositive(frame)
  assertInteger(fps)
  assertAboveZero(fps)  
  return new TimeClass(frame, fps)
}

export const timeFromSeconds = (seconds = 0, fps = 1, rounding = '') : Time => {
  assertPositive(seconds)
  assertInteger(fps)
  assertAboveZero(fps)
  const rounded = roundWithMethod(seconds * fps, rounding)
  return timeFromArgs(rounded, fps)
}

export const stringSeconds = (seconds : number, fps = 0, lengthSeconds = 0, delimiter = '.') : string => {
  const bits: string[] = []
  let pad = 2
  let time = 60 * 60 // an hour
  let do_rest = false //!!fps
  
  const duration = lengthSeconds || seconds

  // console.log('stringSeconds seconds', seconds, 'fps', fps, 'duration', duration)
  if (duration >= time) {
    if (seconds >= time) {
      bits.push(String(Math.floor(seconds / time)).padStart(pad, '0'))
      do_rest = true
      seconds = seconds % time
    } else bits.push('00')
  }
  time = 60 // a minute
  if (do_rest || (duration >= time)) {
    // console.log('stringSeconds duration', duration, '>=', time, 'time')
    if (do_rest) bits.push(COLON)
    if (seconds >= time) {
      bits.push(String(Math.floor(seconds / time)).padStart(pad, '0'))
      do_rest = true
      seconds = seconds % time
    } else bits.push('00')
  } else {
    // console.log('stringSeconds duration', duration, '<', time, 'time')
  }
  time = 1 // a second

  if (do_rest || (duration >= time)) {
    // console.log('stringSeconds duration', duration, '>=', time, 'time')

    if (do_rest) bits.push(COLON)
    if (seconds >= time) {
      // console.log('stringSeconds seconds', seconds, '>=', time, 'time')


      bits.push(String(Math.floor(seconds / time)).padStart(pad, '0'))
      do_rest = true
      seconds = seconds % time
    } else {
      // console.log('stringSeconds seconds', seconds, '<', time, 'time')
      bits.push('00')
    }
  } else {
    // console.log('stringSeconds duration', duration, '<', time, 'time')
    bits.push('00')
  }
  if (fps > 1) {
    // console.log('stringSeconds fps', fps, '> 1')

    pad = String(fps).length - 1
    bits.push(delimiter)
    if (seconds) {
       // console.log('stringSeconds seconds', seconds, 'true pad', pad)

      seconds = Math.round(seconds * fps) / fps
      
      // console.log('stringSeconds seconds', String(seconds), 'presliced')
      seconds = Number(String(seconds).slice(2))

      // console.log('stringSeconds seconds', seconds, 'sliced')

      bits.push(String(seconds).padEnd(pad, '0'))
      // console.log('stringSeconds seconds', seconds, 'padded')
    } else {
      // console.log('stringSeconds seconds', seconds, 'false')
      bits.push('0'.padStart(pad, '0'))
    }
  } else {
    // console.log('stringSeconds fps', fps, '<= 1')
  }
  return bits.join('')
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
