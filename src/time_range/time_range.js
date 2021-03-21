import Time from "../time/time"

class TimeRange extends Time {
  constructor(frame, fps, frames) {
    super(frame, fps)
    this.frames = 1
    if (frames) this.frames = Math.max(1, Number(frames))
  }
  static fromTimes(start, end) {
    if (end) Time.scaleTimes(start, end)
    const frames = end ? Math.max(1, end.frame - start.frame) : 1
    return new TimeRange(start.frame, start.fps, frames)
  }
  
  get end() { return this.frame + this.frames }
  get endTime() { return new TimeRange(this.end, this.fps) }
  get lengthSeconds() { return Number(this.frames) / Number(this.fps) } 
 
  copy() {
    return new TimeRange(this.frame, this.fps, this.frames)
  }
  
  scale(fps = 1, rounding = "round") {
    if (this.fps !== fps) {
      if (this.frames) this.frames = Math.max(1, Math[rounding](Number(this.frames) / (Number(this.fps) / Number(fps))))
      super.scale(fps, rounding)
    }
    return this
  }
  
  copy() {
    return new TimeRange(this.frame, this.fps, this.frames)
  }
  
  intersection(range, or_equals) {
    var result = null
    var range1 = this
    var range2 = range
    if (range1.fps !== range2.fps)
    {
      range1 = range1.copy()
      range2 = range2.copy()
      Time.scaleTimes(range1, range2)
    }
    var last_start = Math.max(range1.frame, range2.frame)
    var first_end = Math.min(range1.end + (range1.frames ? 0 : 1), range2.end + (range2.frames ? 0 : 1))
    if ((last_start < first_end) || (or_equals && (last_start === first_end)))
    {
      result = new TimeRange(last_start, range1.fps, first_end - last_start)
    }
    return result
  }
  
  minLength(range) {
    Time.scaleTimes(this, range)
    this.frames = Math.min(range.frame, this.frames)
  }
}

export default TimeRange