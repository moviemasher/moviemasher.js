import { Errors } from "../../Setup/Errors"
import { isInteger, isNumber } from "../../Utility/Is"
import { roundWithMethod } from "../../Utility/Round"
import { Time, TimeRange } from "./Time"
import { TimeClass, timeEqualizeRates } from "./TimeClass"
import { TimeRangeClass } from "./TimeRangeClass"

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
  if (time2.frame <= time1.frame) {
    console.trace('fromTimes')
    throw Errors.argument + 'fromTimes ' + time1 + ' ' + time2
  }

  const frames = time2.frame - time1.frame
  return timeRangeFromArgs(time1.frame, time1.fps, frames)
}


export const timeFromArgs = (frame = 0, fps = 1) : Time => {
  return new TimeClass(frame, fps)
}

export const timeFromSeconds = (seconds = 0, fps = 1, rounding = '') : Time => {
  if (!isNumber(seconds) || seconds < 0) throw Errors.seconds
  if (!isInteger(fps) || fps < 1) throw Errors.fps

  const rounded = roundWithMethod(seconds * fps, rounding)
  return timeFromArgs(rounded, fps)
}

