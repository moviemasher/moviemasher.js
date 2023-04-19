import { describe, test } from 'node:test'
import assert from 'assert'


import { TimeRangeClass, timeRangeFromArgs, timeRangeFromTimes } from '@moviemasher/lib-core'

describe('TimeRange', () => {
  const range = new TimeRangeClass()
  const rangeOneSecond = new TimeRangeClass(0, 1, 1)
  test('constructor', () => assert.deepStrictEqual(range, rangeOneSecond))
  test('frame', () => assert.equal(range.frame, 0))
  test('frames', () => assert.equal(range.frames, 1))
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
    const intersectingRanges = [
      range,
      timeRangeFromArgs(2, 10, 1),
      timeRangeFromArgs(7, 10, 1)
    ]
    test.each(intersectingRanges)(`${range}.intersects(%s) = true`, timeRange => {
      assert(range.intersects(timeRange))
    })
    const nonintersectingRanges = [
      timeRangeFromArgs(0, 10, 2),
      timeRangeFromArgs(8, 10, 1)
    ]
    test.each(nonintersectingRanges)(`${range}.intersects(%s) = false`, timeRange => {
      assert(!range.intersects(timeRange))
    })
  })
})
