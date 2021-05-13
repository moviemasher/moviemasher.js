import { TimeFactory } from "../Factory/TimeFactory"
import { TimeRangeFactory } from "../Factory/TimeRangeFactory"
import { TimeRange } from "./TimeRange"

const range = new TimeRange
const range_one_second = new TimeRange(0, 1, 1)

describe("TimeRange", () => {
  test("constructor", () => expect(range).toEqual(range_one_second))
  test("frame", () => expect(range.frame).toEqual(0))
  test("frames", () => expect(range.frames).toEqual(1))
  test("fps", () => expect(range.fps).toEqual(1))
  test("copy", () => {
    expect(range.copy).toEqual(range)
    expect(range.copy).not.toBe(range)
  })
  
  test("minEndTime", () => {
    const time = TimeFactory.create(5, 10)
    const time_zero = TimeFactory.create(0, 10)
    const expected = TimeRangeFactory.createFromTimes(time_zero, time)
    expect(range.minEndTime(time)).toEqual(expected)
  })
})