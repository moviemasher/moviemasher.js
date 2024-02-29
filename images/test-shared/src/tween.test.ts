
import { tweenNumber } from '../../../packages/@moviemasher/shared-lib/src/utility/rect.js'
import { describe, test } from 'node:test'
import { timeRangeFromArgs } from '../../../packages/@moviemasher/shared-lib/src/utility/time.js'


describe('tween', () => {
  test('tweenNumber', () => {
    const fps = 30
    const seconds = 3
    const totalFrames = fps * seconds
    const timeRange = timeRangeFromArgs(0, fps, totalFrames)
    const start = tweenNumber(0, 1, timeRange.startTime, timeRange)
    const end = tweenNumber(0, 1, timeRange.endTime, timeRange)
    console.log({ start, end })
    // arrayOfNumbers(totalFrames).forEach(frame => {
    //   const time = timeRangeFromArgs(frame, fps, totalFrames - frame)
    //   const number = tweenNumber(0, 1, timeRange.startTime, timeRange)
    //   console.log({ frame, number })
    // })
  })
})