import type { TimeRanges } from '../../../packages/@moviemasher/shared-lib/src/types.js'

import { $FRAME, $FRAMES } from '../../../packages/@moviemasher/shared-lib/src/runtime.js'
import assert from 'assert'
import { describe, test } from 'node:test'
import { TimeRangeClass, stringSeconds, timeFromArgs, timeFromSeconds, timeRangeFromArgs, timeRangeFromTimes } from '../../../packages/@moviemasher/shared-lib/src/utility/time.js'

describe('TimeRange', () => {
  const range = new TimeRangeClass()
  const rangeOneSecond = new TimeRangeClass(0, 1, 1)
  test('constructor', () => assert.deepStrictEqual(range, rangeOneSecond))
  test($FRAME, () => assert.equal(range.frame, 0))
  test($FRAMES, () => assert.equal(range.frames, 1))
  test('fps', () => assert.equal(range.fps, 1))
  test('copy', () => {
    assert.deepStrictEqual(range.copy, range)
    assert.notEqual(range.copy, range)
  })

  test('minEndTime', () => {
    const time = timeRangeFromArgs(5, 10)
    const timeZero = timeRangeFromArgs(0, 10)
    const expected = timeRangeFromTimes(timeZero, time)
    assert.deepStrictEqual(range.minEndTime(time), expected)
  })
  describe('intersects', () => {
    const range = timeRangeFromArgs(2, 10, 6)
    
    const intersectingRanges: TimeRanges = [
      range,
      timeRangeFromArgs(2, 10, 1),
      timeRangeFromArgs(7, 10, 1)
    ]
    intersectingRanges.forEach(timeRange => {
      test(`${range}.intersects(${timeRange}) = true`, () => {
        assert(range.intersects(timeRange))
      })
    })
    const nonintersectingRanges = [
      timeRangeFromArgs(0, 10, 2),
      timeRangeFromArgs(8, 10, 1)
    ]
    nonintersectingRanges.forEach(timeRange => {
      test(`${range}.intersects(${timeRange}) = false`, () => {
        assert(!range.intersects(timeRange))
      })
    })
  })
})

describe('Time', () => {
  describe('createFromSeconds', () => {
    test('throws when seconds is invalid', () => {
      const frameString = '0' as unknown as number
      assert.throws(() => timeFromSeconds(frameString, 1))
      assert.throws(() => timeFromSeconds(-1, 1))
    })
    test('throws when fps is invalid', () => {
      const framesString = '57' as unknown as number
      assert.throws(() => timeFromSeconds(0, framesString))
      assert.throws(() => timeFromSeconds(0, 0))
      assert.throws(() => timeFromSeconds(0, 1.1))
    })
    test('returns zero frame and one fps for no arguments', () => {
      const time = timeFromSeconds()
      assert.equal(time.frame, 0)
      assert.equal(time.fps, 1)
    })
    test('returns supplied frame and fps', () => {
      const seconds = 4
      const fps = 20
      const time = timeFromSeconds(seconds, fps)
      assert.equal(time.frame, seconds * fps)
      assert.equal(time.fps, fps)
    })
    test('returns proper frame for float', () => {
      const seconds = 4.55
      const fps = 10
      const time = timeFromSeconds(seconds, fps, 'floor')
      assert.equal(time.frame, 45)
    })
  })

  const makeTimes = (quantize = 1, count = 100) => (
    (new Array(count).fill(true)).map((_, i) => (
      timeFromArgs(i, quantize)
    ))
  )

  const times1 = makeTimes()
  const times10 = makeTimes(10)
  const times30 = makeTimes(30)
  describe('timeFromArgs', () => {
    test('throws when frame is invalid', () => {
      const frameString = '0' as unknown as number
      assert.throws(() => timeFromArgs(frameString, 1))
      assert.throws(() => timeFromArgs(-1, 1))
      assert.throws(() => timeFromArgs(0.1, 1))
    })
    test('throws when fps is invalid', () => {
      const fpsString = '1'  as unknown as number
      assert.throws(() => timeFromArgs(0, fpsString))
      assert.throws(() => timeFromArgs(0, 0))
      assert.throws(() => timeFromArgs(0, 1.1))
    })
    test('returns zero frame and one fps for no arguments', () => {
      const time = timeFromArgs()
      assert.equal(time.frame, 0)
      assert.equal(time.fps, 1)
    })
    test('returns supplied frame and fps', () => {
      const time130 = timeFromArgs(1, 30)
      assert.equal(time130.frame, 1)
      assert.equal(time130.fps, 30)
   
      const frame = 4
      const fps = 20
      const time = timeFromArgs(frame, fps)
      assert.equal(time.frame, frame)
      assert.equal(time.fps, fps)
    })
  })
  
  
  describe('scale', () => {
    test('returns scaled time', () => {
      const time = timeFromArgs(1, 30)
      const scaled = time.scale(10)
      assert.equal(scaled.frame, 0)
    })
  })

  
})

describe('stringSeconds', () => {
  test('returns expected response', () => {
    assert.equal(stringSeconds(0, 10, 0), '0')
    assert.equal(stringSeconds(0.5, 30, 3), '00.50')
    assert.equal(stringSeconds(0.9, 30, 3), '00.90')
    assert.equal(stringSeconds(0.12324, 30, 3), '00.12')
    assert.equal(stringSeconds(0.126, 30, 3), '00.13')
    assert.equal(stringSeconds(0.5, 10, 3), '00.5')
    assert.equal(stringSeconds(5.51, 10, 100), '00:05.5')
    assert.equal(stringSeconds(5.57, 10, 100), '00:05.6')
    assert.equal(stringSeconds(65.57, 10, 100), '01:05.6')
  })
})