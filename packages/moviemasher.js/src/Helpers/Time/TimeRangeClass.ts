import { Is } from "../../Utility/Is"
import { TimeClass, timeEqualizeRates } from "./TimeClass"
import { roundWithMethod } from "../../Utility/Round"
import { Errors } from "../../Setup/Errors"
import { Time, TimeRange, TimeRanges, Times } from "./Time"

class TimeRangeClass extends TimeClass implements TimeRange {
  frames : number

  constructor(frame = 0, fps = 1, frames = 1) {
    super(frame, fps)
    if (!(Is.integer(frames) && frames >= 0)) throw Errors.timeRange + 'frames'

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

  includes(frame: number): boolean {
    return frame >= this.frame && frame <= this.end
  }

  includesTime(time : Time) : boolean {
    const [thisTime, scaledTime] = timeEqualizeRates(this, time)
    const thisRange = thisTime as TimeRange
    const { frame, end } = thisRange
    const other = scaledTime.frame
    return other >= frame && other < end
  }

  intersects(time: Time): boolean {
    if (!time.isRange) return this.includesTime(time)

    const [range1, range2] = timeEqualizeRates(time, this) as TimeRanges
    if (range1.frame >= range2.end) return false

    return range1.end > range2.frame
  }
  isRange = true

  get lengthSeconds() : number { return Number(this.frames) / Number(this.fps) }

  get position(): number { return Number(this.frame) / Number(this.frames) }

  positionTime(position: number, rounding = ''): Time {
    const frame = roundWithMethod((this.frames - this.frame) * position, rounding)
    return new TimeClass(this.frame + frame, this.fps)
  }

  get startTime() : Time { return new TimeClass(this.frame, this.fps) }

  scale(fps = 1, rounding = "") : TimeRange {
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

export { TimeRangeClass }
