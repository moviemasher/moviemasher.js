import { Errors } from "../Setup"
import { Is } from "./Is"

interface TimeInterface {
  copy : TimeInterface
  frame : number
  fps : number
  scale : Function
  description : string
}

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

const scaleTimes = (time1 : TimeInterface, time2 : TimeInterface, rounding = "round") => {
  if (time1.fps === time2.fps) return [time1, time2]

  const gcf = lowestCommonMultiplier(time1.fps, time2.fps)
  return [
    time1.scale(gcf, rounding),
    time2.scale(gcf, rounding)
  ]
}

const roundingMethod = (rounding:string = 'round') : Function => {
  switch (rounding) {
    case 'ceil': return Math.ceil
    case 'floor': return Math.floor
    default: return Math.round
  }
}

const roundWithMethod = (number : number, method = "round") : number => (
  roundingMethod(method)(number)
)

class Time implements TimeInterface {
  frame : number

  fps : number

  constructor(frame = 0, fps = 1) {
    if (!Is.integer(frame) || frame < 0) throw Errors.frame
    if (!Is.integer(fps) || fps < 1) throw Errors.fps

    this.frame = frame
    this.fps = fps
  }

  add(time) {
    const [time1, time2] = scaleTimes(this, time)
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
    if (!Is.number(number)) throw Errors.argument
    return new Time(roundWithMethod(Number(this.frame) / number, rounding), this.fps)
  }

  equalsTime(time) {
    if (!(time instanceof Time)) throw Errors.time

    const [time1, time2] = scaleTimes(this, time)
    return time1.frame === time2.frame
  }

  min(time : TimeInterface) {
    if (!Is.instanceOf(time, Time)) throw Errors.time

    const [time1, time2] = scaleTimes(this, time)
    return new Time(Math.min(time1.frame, time2.frame), time1.fps)
  }

  scale(fps = 1, rounding = "round") : Time {
    if (this.fps === fps) return this

    const frame = Number(this.frame / this.fps) * Number(fps)
    return new Time(roundWithMethod(frame, rounding), fps)
  }

  get seconds() { return Number(this.frame) / Number(this.fps) }

  subtract(time : TimeInterface) : Time {
    if (!Is.instanceOf(time, Time)) throw Errors.argument

    const [time1, time2] = scaleTimes(this, time)

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

  toString() { return `[${this.description}]` }

  withFrame(frame : number) : Time {
    const time = this.copy
    time.frame = frame
    return time
  }
}

export { Time, scaleTimes, roundWithMethod }
