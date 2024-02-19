import type { TimeRanges, Times } from '../../../packages/@moviemasher/shared-lib/src/types.js'

import { tweenNumber } from '../../../packages/@moviemasher/shared-lib/src/utility/rect.js'
import assert from 'assert'
import { describe, test } from 'node:test'
import { TimeRangeClass, stringSeconds, timeFromArgs, timeFromSeconds, timeRangeFromArgs, timeRangeFromTimes } from '../../../packages/@moviemasher/shared-lib/src/utility/time.js'
import { arrayOfNumbers } from '../../../packages/@moviemasher/shared-lib/src/runtime.js'


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