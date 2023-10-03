import { assertAboveZero, assertInteger, assertPositive } from '../../Shared/SharedGuards.js'
import { roundWithMethod } from '../../Utility/RoundFunctions.js'
import { Time, TimeRange } from '@moviemasher/runtime-shared'
import { TimeClass, timeEqualizeRates } from './TimeClass.js'
import { TimeRangeClass } from './TimeRangeClass.js'
import { errorThrow } from '@moviemasher/runtime-shared'
import { ERROR } from '@moviemasher/runtime-shared'

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
  if (time2.frame <= time1.frame) return errorThrow(ERROR.Frame)
  
  const frames = time2.frame - time1.frame
  return timeRangeFromArgs(time1.frame, time1.fps, frames)
}


export const timeFromArgs = (frame = 0, fps = 1) : Time => {
  assertPositive(frame)
  assertInteger(fps)
  assertAboveZero(fps)  
  return new TimeClass(frame, fps)
}

export const timeFromSeconds = (seconds = 0, fps = 1, rounding = '') : Time => {
  assertPositive(seconds)
  assertInteger(fps)
  assertAboveZero(fps)
  const rounded = roundWithMethod(seconds * fps, rounding)
  return timeFromArgs(rounded, fps)
}

export const stringSeconds = (seconds : number, fps = 0, lengthSeconds = 0, delimiter = '.') : string => {
  const bits: string[] = []
  let pad = 2
  let time = 60 * 60 // an hour
  let do_rest = !!fps
  
  const duration = lengthSeconds || seconds

  // console.log('stringSeconds seconds', seconds, 'fps', fps, 'duration', duration)
  if (duration >= time) {
    if (seconds >= time) {
      bits.push(String(Math.floor(seconds / time)).padStart(pad, '0'))
      do_rest = true
      seconds = seconds % time
    } else bits.push('00')
  }
  time = 60 // a minute
  if (do_rest || (duration >= time)) {
    // console.log('stringSeconds duration', duration, '>=', time, 'time')
    if (do_rest) bits.push(':')
    if (seconds >= time) {
      bits.push(String(Math.floor(seconds / time)).padStart(pad, '0'))
      do_rest = true
      seconds = seconds % time
    } else bits.push('00')
  } else {
    // console.log('stringSeconds duration', duration, '<', time, 'time')
  }
  time = 1 // a second

  if (do_rest || (duration >= time)) {
    // console.log('stringSeconds duration', duration, '>=', time, 'time')

    if (do_rest) bits.push(':')
    if (seconds >= time) {
      // console.log('stringSeconds seconds', seconds, '>=', time, 'time')


      bits.push(String(Math.floor(seconds / time)).padStart(pad, '0'))
      do_rest = true
      seconds = seconds % time
    } else {
      // console.log('stringSeconds seconds', seconds, '<', time, 'time')
      bits.push('00')
    }
  } else {
    // console.log('stringSeconds duration', duration, '<', time, 'time')
    bits.push('00')
  }
  if (fps > 1) {
    // console.log('stringSeconds fps', fps, '> 1')

    pad = String(fps).length - 1
    bits.push(delimiter)
    if (seconds) {
       // console.log('stringSeconds seconds', seconds, 'true pad', pad)

      seconds = Math.round(seconds * fps) / fps
      
      // console.log('stringSeconds seconds', String(seconds), 'presliced')
      seconds = Number(String(seconds).slice(2))

      // console.log('stringSeconds seconds', seconds, 'sliced')

      bits.push(String(seconds).padEnd(pad, '0'))
      // console.log('stringSeconds seconds', seconds, 'padded')
    } else {
      // console.log('stringSeconds seconds', seconds, 'false')
      bits.push('0'.padStart(pad, '0'))
    }
  } else {
    // console.log('stringSeconds fps', fps, '<= 1')
  }
  return bits.join('')
}
