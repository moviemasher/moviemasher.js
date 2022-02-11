import { Errors } from "../Setup/Errors"
import { Is } from "../Utility/Is"
import { roundWithMethod } from "../Utility/Round"

const greatestCommonDenominator = (fps1 : number, fps2 : number) : number => {
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

const lowestCommonMultiplier = (a : number, b : number) : number => (
  (a * b) / greatestCommonDenominator(a, b)
)

const timeEqualizeRates = (time1 : Time, time2 : Time, rounding = '') : Time[] => {
  if (time1.fps === time2.fps) return [time1, time2]

  const gcf = lowestCommonMultiplier(time1.fps, time2.fps)
  return [
    time1.scale(gcf, rounding),
    time2.scale(gcf, rounding)
  ]
}

class Time implements Time {
  frame : number

  fps : number

  constructor(frame = 0, fps = 1) {
    if (!Is.integer(frame) || frame < 0) throw Errors.frame
    if (!Is.integer(fps) || fps < 1) throw Errors.fps

    this.frame = frame
    this.fps = fps
  }

  add(time : Time) : Time {
    const [time1, time2] = timeEqualizeRates(this, time)
    return new Time(time1.frame + time2.frame, time1.fps)
  }

  addFrame(frames : number) : Time {
    const time = this.copy
    time.frame += frames
    return time
  }

  get copy() : Time { return new Time(this.frame, this.fps) }

  get description() : string { return `${this.frame}@${this.fps}` }

  divide(number : number, rounding = '') : Time {
    if (!Is.number(number)) throw Errors.argument + 'divide'
    return new Time(roundWithMethod(Number(this.frame) / number, rounding), this.fps)
  }

  equalsTime(time : Time) : boolean {
    const [time1, time2] = timeEqualizeRates(this, time)
    return time1.frame === time2.frame
  }

  min(time : Time) : Time {
    const [time1, time2] = timeEqualizeRates(this, time)
    return new Time(Math.min(time1.frame, time2.frame), time1.fps)
  }

  scale(fps : number, rounding = '') : Time {
    if (this.fps === fps) return this

    const frame = (Number(this.frame) / Number(this.fps)) * Number(fps)
    return new Time(roundWithMethod(frame, rounding), fps)
  }

  scaleToFps(fps : number) : Time { return this.scaleToTime(new Time(0, fps)) }

  scaleToTime(time : Time) : Time {
    return timeEqualizeRates(this, time)[0]
  }
  get seconds() : number { return Number(this.frame) / Number(this.fps) }

  subtract(time : Time) : Time {
    const [time1, time2] = timeEqualizeRates(this, time)

    let subtracted = time2.frame
    if (subtracted > time1.frame) {
      subtracted -= subtracted - time1.frame
    }
    return new Time(time1.frame - subtracted, time1.fps)
  }

  subtractFrames(frames : number) : Time {
    const time = this.copy
    time.frame -= frames
    return time
  }

  toString() : string { return `[${this.description}]` }

  withFrame(frame : number) : Time {
    const time = this.copy
    time.frame = frame
    return time
  }

  static fromArgs(frame = 0, fps = 1) : Time {
    return new Time(frame, fps)
  }

  static fromSeconds(seconds = 0, fps = 1, rounding = '') : Time {
    if (!Is.number(seconds) || seconds < 0) throw Errors.seconds
    if (!Is.integer(fps) || fps < 1) throw Errors.fps

    const rounded = roundWithMethod(seconds * fps, rounding)
    return this.fromArgs(rounded, fps)
  }
}
type Times = Time[]

export { Time, Times, timeEqualizeRates }
