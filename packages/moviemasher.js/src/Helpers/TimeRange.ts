import { Is } from "../Utility/Is"
import { Time, timeEqualizeRates } from "./Time"
import { roundWithMethod } from "../Utility/Round"
import { Errors } from "../Setup/Errors"

class TimeRange extends Time {
  frames : number

  constructor(frame = 0, fps = 1, frames = 1) {
    if (!(Is.integer(frames) && frames >= 0)) {
      console.trace("TimeRange with frames", frames, frames.constructor.name)
      throw Errors.argument + 'frames'
    }
    super(frame, fps)
    this.frames = frames
  }

  addFrames(frames : number) : TimeRange {
    const time = this.copy
    time.frames += frames
    return time
  }

  get copy() : TimeRange {
    return new TimeRange(this.frame, this.fps, this.frames)
  }

  get description() : string { return `${this.frame}-${this.frames}@${this.fps}` }

  get end() : number { return this.frame + this.frames }

  get endTime() : Time { return Time.fromArgs(this.end, this.fps) }

  equalsTimeRange(timeRange : TimeRange) : boolean {
    const [range1, range2] = <TimeRange[]> timeEqualizeRates(this, timeRange)
    return range1.frame === range2.frame && range1.frames === range2.frames
  }

  intersects(timeRange : TimeRange) : boolean {
    const [range1, range2] = <TimeRange[]> timeEqualizeRates(this, timeRange)

    if (range1.frame >= range2.end) return false

    return range1.end > range2.frame
  }

  intersectsTime(time : Time) : boolean {
    const [time1, scaledTime] = timeEqualizeRates(this, time)
    const scaledRange = <TimeRange> time1
    return scaledTime.frame >= scaledRange.frame && scaledTime.frame < scaledRange.end

  }

  get lengthSeconds() : number { return Number(this.frames) / Number(this.fps) }

  get position(): number { return Number(this.frame) / Number(this.frames) }

  positionTime(position: number, rounding = ''): Time {
    const frame = roundWithMethod((this.frames - this.frame) * position, rounding)
    return Time.fromArgs(this.frame + frame, this.fps)
  }

  get startTime() : Time { return Time.fromArgs(this.frame, this.fps) }

  scale(fps = 1, rounding = "") : TimeRange {
    if (this.fps === fps) return this.copy

    const value = Number(this.frames) / (Number(this.fps) / Number(fps))
    const time = super.scale(fps, rounding)
    const frames = Math.max(1, roundWithMethod(value, rounding))
    return new TimeRange(time.frame, time.fps, frames)
  }

  minEndTime(endTime : Time) : TimeRange {
    const [range, time] = <TimeRange[]> timeEqualizeRates(this, endTime)
    range.frames = Math.min(range.frames, time.frame)
    return range
  }

  get times(): Time[] {
    const { frames, frame, fps } = this
    return Array.from({ length: frames + 1 }, (_, i) => Time.fromArgs(frame + i, fps))
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

  static fromArgs(frame = 0, fps = 1, frames = 1) : TimeRange {
    return new TimeRange(frame, fps, frames)
  }

  static fromSeconds(start = 0, duration = 1) : TimeRange {
    return this.fromArgs(start, 1, duration)
  }

  static fromTime(time : Time, frames = 1) : TimeRange {
    return this.fromArgs(time.frame, time.fps, frames)
  }

  static fromTimes(startTime : Time, endTime : Time) : TimeRange {
    const [time1, time2] = <TimeRange[]> timeEqualizeRates(startTime, endTime)
    if (time2.frame <= time1.frame) {
      console.trace('fromTImes')
      throw Errors.argument + 'fromTimes ' + time1 + ' ' + time2
    }

    const frames = time2.frame - time1.frame
    return this.fromArgs(time1.frame, time1.fps, frames)
  }
}

export { TimeRange }
