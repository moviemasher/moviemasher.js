import { TimeRange } from "./TimeRange"

describe("TimeRange", () => {
  const range = new TimeRange()
  const rangeOneSecond = new TimeRange(0, 1, 1)
  test("constructor", () => expect(range).toEqual(rangeOneSecond))
  test("frame", () => expect(range.frame).toEqual(0))
  test("frames", () => expect(range.frames).toEqual(1))
  test("fps", () => expect(range.fps).toEqual(1))
  test("copy", () => {
    expect(range.copy).toEqual(range)
    expect(range.copy).not.toBe(range)
  })

  test("minEndTime", () => {
    const time = TimeRange.fromArgs(5, 10)
    const timeZero = TimeRange.fromArgs(0, 10)
    const expected = TimeRange.fromTimes(timeZero, time)
    expect(range.minEndTime(time)).toEqual(expected)
  })
})
