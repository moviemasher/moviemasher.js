import { Errors } from "../Setup"
import { Is, Time, TimeRange, scaleTimes } from "../Utilities"

const createFromArgs = (frame, fps, frames) => new TimeRange(frame, fps, frames)

const createFromSeconds = (start, duration) => createFromArgs(start, 1, duration)

const createFromTime = (time : Time, frames = 1) : TimeRange => (
  createFromArgs(time.frame, time.fps, frames)
)

const createFromTimes = (startTime, endTime) => {
  const [time1, time2] = scaleTimes(startTime, endTime)
  if (time2.frame <= time1.frame) throw Errors.argument

  return createFromArgs(time1.frame, time1.fps, time2.frame - time1.frame)
}

const createFromOptions = (object = {}) : TimeRange => {
  if (Is.instanceOf(object, TimeRange)) return object
  if (Is.instanceOf(object, Time)) return createFromTime(<Time>object)

  const { frame, fps, frames } = object
  return createFromArgs(frame, fps, frames)
}

const TimeRangeFactory = {
  createFromOptions, createFromSeconds, createFromTime, createFromTimes
}

export { TimeRangeFactory }
