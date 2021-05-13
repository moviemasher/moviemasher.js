import { Errors } from "../Errors"
import { Is } from '../Is'

const greatestCommonDenominator = (a, b) => {
    var t
    while (b !== 0) {
      t = b
      b = a % b
      a = t
    }
    return a
}
  
const lowestCommonMultiplier = (a, b) => { return (a * b / greatestCommonDenominator(a, b)) }

class Time {
  static get zero() { return new Time }

  static scaleTimes(time1, time2, rounding = "round") {
    if (time1.fps === time2.fps) return [time1, time2]

    var gcf = lowestCommonMultiplier(time1.fps, time2.fps)
    return [
      time1.scale(gcf, rounding),
      time2.scale(gcf, rounding)
    ]
  }
  
  constructor(frame = 0, fps = 1) {
    if (!Is.integer(frame) || frame < 0) throw(Errors.frame)
    if (!Is.integer(fps) || fps < 1) throw(Errors.fps)
    
    this.frame = frame
    this.fps = fps
  }

  add(time) {
    const [time1, time2] = Time.scaleTimes(this, time)
    return new Time(time1.frame + time2.frame, time1.fps)
  }

  addFrames(frames) {
    const time = this.copy
    time.frame += frames
    return time 
  }

  get copy() { return new Time(this.frame, this.fps) }

  get description() { return `${this.frame}@${this.fps}` }

  divide(number, rounding = "round") {
    if (!Is.number(number)) throw(Errors.argument)
    return new Time(Math[rounding](Number(this.frame) / number), this.fps)
  }
  
  equalsTime(time) {
    if (!(time instanceof Time)) throw(Errors.time)

    const [time1, time2] = Time.scaleTimes(this, time)
    return time1.frame === time2.frame
  }

  min(time) {
    if (! time instanceof Time) throw(Errors.time)
    
    const [time1, time2] = Time.scaleTimes(this, time)
    return new Time(Math.min(time1.frame, time2.frame), time1.fps)
  } 

  scale(fps = 1, rounding = "round") {
    if (this.fps === fps) return this
    //const scale = Number(this.fps) / Number(fps)
    const frame = Number(this.frame / this.fps) * Number(fps)
    return new Time(Math[rounding](frame), fps)
  }

  get seconds() { return Number(this.frame) / Number(this.fps) }
  
  subtract(time) {
    if (! time instanceof Time) throw(Errors.argument)
    const [time1, time2] = Time.scaleTimes(this, time)
  
    var subtracted = time2.frame
    if (subtracted > time1.frame) {
      subtracted -= subtracted - time1.frame
    }
    return new Time(time1.frame - subtracted, time1.fps)
  }

  subtractFrames(frames) {
    const time = this.copy
    time.frame -= frames
    return time 
  }

  toString() { return `[${this.description}]` }

  withFrame(frame) { 
    const time = this.copy
    time.frame = frame
    return time 
  }
}

export { Time }