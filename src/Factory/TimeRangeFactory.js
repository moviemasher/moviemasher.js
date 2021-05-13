import { Errors } from '../Errors';
import { Is } from '../Is'
import { TimeRange } from "../TimeRange";
import { Time } from '../Time';

const createFromArgs = (frame, fps, frames) => new TimeRange(frame, fps, frames)

const createFromSeconds = (start, duration) => createFromArgs(start, 1, duration)

const createFromTime = (time, frames) => (
  createFromArgs(time.frame, time.fps, frames)
)

const createFromTimes = (startTime, endTime) => {
  const [time1, time2] = Time.scaleTimes(startTime, endTime)
  if (time2.frame <= time1.frame) throw Errors.argument

  return createFromArgs(time1.frame, time1.fps, time2.frame - time1.frame)
}

const create = (object = {}) => { 
  if (Is.instance(object, TimeRange)) return object
  if (Is.instance(object, Time)) return createFromTime(object)

  const { frame, fps, frames } = object
  return createFromArgs(frame, fps, frames) 
}

const TimeRangeFactory = {
  create, createFromSeconds, createFromTime, createFromTimes
}

export { TimeRangeFactory }
