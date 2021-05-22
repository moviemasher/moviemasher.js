import { Errors } from "../Setup"
import { TimeFactory } from "./TimeFactory"
import { TimeRangeFactory } from "./TimeRangeFactory"

describe("TimeFactory", () => {
  describe("create", () => {
    test("returns supplied frame and fps", () => {
      const time = TimeFactory.createFromFrame(1, 30)
      expect(time.frame).toEqual(1)
      expect(time.fps).toEqual(30)
    })
  })
  describe("createFromSeconds", () => {
    test("throws when seconds is invalid", () => {
      expect(() => TimeFactory.createFromSeconds("0", 1)).toThrow(Errors.seconds)
      expect(() => TimeFactory.createFromSeconds(-1, 1)).toThrow(Errors.seconds)
    })
    test("throws when fps is invalid", () => {
      expect(() => TimeFactory.createFromSeconds(0, "1")).toThrow(Errors.fps)
      expect(() => TimeFactory.createFromSeconds(0, 0)).toThrow(Errors.fps)
      expect(() => TimeFactory.createFromSeconds(0, 1.1)).toThrow(Errors.fps)
    })
    test("returns zero frame and one fps for no arguments", () => {
      const time = TimeFactory.createFromSeconds()
      expect(time.frame).toEqual(0)
      expect(time.fps).toEqual(1)
    })
    test("supplied frame and fps", () => {
      const seconds = 4
      const fps = 20
      const time = TimeFactory.createFromSeconds(seconds, fps)
      expect(time.frame).toEqual(seconds * fps)
      expect(time.fps).toEqual(fps)
    })
  })
})

describe("Time", () => {
  const times = (quantize = 1, count = 100) => (
    (new Array(count).fill(true)).map((_, i) => (
      TimeRangeFactory.createFromFrame(i, quantize)
    ))
  )

  const times1 = times()
  const times10 = times(10)
  const times30 = times(30)
  describe("constructor", () => {
    test("throws when frame is invalid", () => {
      expect(() => TimeRangeFactory.createFromFrame("0", 1)).toThrow(Errors.frame)
      expect(() => TimeRangeFactory.createFromFrame(-1, 1)).toThrow(Errors.frame)
      expect(() => TimeRangeFactory.createFromFrame(0.1, 1)).toThrow(Errors.frame)
    })
    test("throws when fps is invalid", () => {
      expect(() => TimeRangeFactory.createFromFrame(0, "1")).toThrow(Errors.fps)
      expect(() => TimeRangeFactory.createFromFrame(0, 0)).toThrow(Errors.fps)
      expect(() => TimeRangeFactory.createFromFrame(0, 1.1)).toThrow(Errors.fps)
    })
    test("returns zero frame and one fps for no arguments", () => {
      const time = TimeRangeFactory.createFromFrame
      expect(time.frame).toEqual(0)
      expect(time.fps).toEqual(1)
    })
    test("supplied frame and fps", () => {
      const frame = 4
      const fps = 20
      const time = TimeRangeFactory.createFromFrame(frame, fps)
      expect(time.frame).toEqual(frame)
      expect(time.fps).toEqual(fps)
    })
  })
  describe("equalsTime", () => {
    const mins = [
      ["times equal", times1[0], times10[0], times30[0]],
      ["times equal", times1[1], times10[10], times30[30]],
      ["callee is earlier", times10[0], times10[1], times10[0]],
      ["callee is earlier", times10[1], times1[1], times10[1]],
      ["callee is later", times10[1], times10[0], times10[0]],
      ["callee is later", times1[1], times10[1], times10[1]],
    ]
    describe.each(mins)("when %s", (_, time1, time2, expected) => {
      test(`${time1}.min(${time2}) returns ${expected}`, () => {
        expect(time1.min(time2).equalsTime(expected)).toBeTruthy()
      })
    })
  })
  describe("scale", () => {
    test("returns scaled time", () => {
      const time = TimeRangeFactory.createFromFrame(1, 30)
      const scaled = time.scale(10)
      expect(scaled.frame).toEqual(0)
    })
  })
})
