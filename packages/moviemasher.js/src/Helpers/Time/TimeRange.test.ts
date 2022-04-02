import { TimeRangeClass } from "./TimeRangeClass"
import { timeRangeFromArgs, timeRangeFromTimes } from "./TimeUtilities"

describe("TimeRange", () => {
  const range = new TimeRangeClass()
  const rangeOneSecond = new TimeRangeClass(0, 1, 1)
  test("constructor", () => expect(range).toEqual(rangeOneSecond))
  test("frame", () => expect(range.frame).toEqual(0))
  test("frames", () => expect(range.frames).toEqual(1))
  test("fps", () => expect(range.fps).toEqual(1))
  test("copy", () => {
    expect(range.copy).toEqual(range)
    expect(range.copy).not.toBe(range)
  })

  test("minEndTime", () => {
    const time = timeRangeFromArgs(5, 10)
    const timeZero = timeRangeFromArgs(0, 10)
    const expected = timeRangeFromTimes(timeZero, time)
    expect(range.minEndTime(time)).toEqual(expected)
  })
  describe("intersects", () => {
    const range = timeRangeFromArgs(2, 10, 6)
    const intersectingRanges = [
      range,
      timeRangeFromArgs(2, 10, 1),
      timeRangeFromArgs(7, 10, 1)
    ]
    test.each(intersectingRanges)(`${range}.intersects(%s) = true`, timeRange => {
      expect(range.intersects(timeRange)).toBe(true)
    })
    const nonintersectingRanges = [
      timeRangeFromArgs(0, 10, 2),
      timeRangeFromArgs(8, 10, 1)
    ]
    test.each(nonintersectingRanges)(`${range}.intersects(%s) = false`, timeRange => {
      expect(range.intersects(timeRange)).toBe(false)
    })
  })
})
