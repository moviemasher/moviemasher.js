import { Is } from '../Is'
import { Time } from "../Time"
import { Errors } from '../Errors'
import { TimeFactory } from '../Factory/TimeFactory'

class TimeRange extends Time {
  constructor(frame = 0, fps = 1, frames = 1) {
    if (!(Is.integer(frames) && frames >= 0)) {
      throw(Errors.argument, frames)
    }
    super(frame, fps)
    this.frames = frames
  }
  
  get description() { return `${this.frame}-${this.frames}@${this.fps}` }
  get end() { return this.frame + this.frames }
  get endTime() { return TimeFactory.create(this.end, this.fps) }
  get lengthSeconds() { return Number(this.frames) / Number(this.fps) } 
  get position() { return  Number(this.frame) / Number(this.frames) }
  get startTime() { return TimeFactory.create(this.frame, this.fps) } 
  get copy() {
    return new TimeRange(this.frame, this.fps, this.frames)
  }
  
  scale(fps = 1, rounding = "round") {
    if (this.fps === fps) return this.copy

    const value = Number(this.frames) / (Number(this.fps) / Number(fps))
    const time = super.scale(fps, rounding)
    return new TimeRange(time.frame, time.fps, Math.max(1, Math[rounding](value)))
  }
 
  intersects(timeRange) {
    const [range1, range2] = Time.scaleTimes(this, timeRange)

    if (range1.frame >= range2.end) return false
    
    return range1.end > range2.frame
  }
  
  minEndTime(endTime) {
    const [range, time] = Time.scaleTimes(this, endTime)
    range.frames = Math.min(range.frames, time.frame)
    return range
  }

  withFrame(frame) { 
    const range = this.copy
    range.frame = frame
    return range 
  }

  withFrames(frames) { 
    const range = this.copy
    range.frames = frames
    return range 
  }

}

export { TimeRange }