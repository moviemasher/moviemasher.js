import { Is } from "./Is"
import { Time, scaleTimes, roundWithMethod } from "./Time"
import { Errors } from "../Setup/Errors"

class TimeRange extends Time {
  frames : number

  constructor(frame = 0, fps = 1, frames = 1) {
    if (!(Is.integer(frames) && frames >= 0)) {
      throw Errors.argument + 'frames'
    }
    super(frame, fps)
    this.frames = frames
  }

  get description() : string { return `${this.frame}-${this.frames}@${this.fps}` }

  get end() : number { return this.frame + this.frames }

  get endTime() : Time { return Time.fromArgs(this.end, this.fps) }

  get lengthSeconds() : number { return Number(this.frames) / Number(this.fps) }

  get position() : number { return Number(this.frame) / Number(this.frames) }

  get startTime() : Time { return Time.fromArgs(this.frame, this.fps) }

  get copy() : TimeRange {
    return new TimeRange(this.frame, this.fps, this.frames)
  }

  scale(fps = 1, rounding = "") : TimeRange {
    if (this.fps === fps) return this.copy

    const value = Number(this.frames) / (Number(this.fps) / Number(fps))
    const time = super.scale(fps, rounding)
    const frames = Math.max(1, roundWithMethod(value, rounding))
    return new TimeRange(time.frame, time.fps, frames)
  }

  intersects(timeRange : TimeRange) : boolean {
    const [range1, range2] = <TimeRange[]> scaleTimes(this, timeRange)

    if (range1.frame >= range2.end) return false

    return range1.end > range2.frame
  }

  intersectsTime(time : Time) : boolean {
    const [time1, scaledTime] = scaleTimes(this, time)
    const scaledRange = <TimeRange> time1
    return scaledTime.frame >= scaledRange.frame && scaledTime.frame < scaledRange.end

  }

  minEndTime(endTime : Time) : TimeRange {
    const [range, time] = <TimeRange[]> scaleTimes(this, endTime)
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
    const [time1, time2] = <TimeRange[]> scaleTimes(startTime, endTime)
    if (time2.frame <= time1.frame) throw Errors.argument

    const frames = time2.frame - time1.frame
    return this.fromArgs(time1.frame, time1.fps, frames)
  }
}

export { TimeRange }
