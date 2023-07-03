import type { Numbers, Time, TimeRange } from '@moviemasher/runtime-shared'

import { errorThrow, ErrorName } from '@moviemasher/runtime-shared'
import { assertAboveZero, assertInteger, assertPositive } from '../../Shared/SharedGuards.js'
import { roundWithMethod } from '../../Utility/RoundFunctions.js'
import { arrayOfNumbers } from '../../Utility/ArrayFunctions.js'

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

export const timeEqualizeRates = (time1 : Time, time2 : Time, rounding = '') : Time[] => {
  if (time1.fps === time2.fps) return [time1, time2]

  const gcf = timeLowestCommonMultiplier(time1.fps, time2.fps)
  return [
    time1.scale(gcf, rounding),
    time2.scale(gcf, rounding)
  ]
}

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

  get timeRange(): TimeRange { return errorThrow(ErrorName.Internal) }

  toString() : string { return `[${this.description}]` }

  withFrame(frame : number) : Time {
    const time = this.copy
    time.frame = frame
    return time
  }
}
