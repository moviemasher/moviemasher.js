import { Errors } from "../Setup/Errors"
import { Time } from "./Time"

describe("Time", () => {
  describe("create", () => {
    test("returns supplied frame and fps", () => {
      const time = Time.fromArgs(1, 30)
      expect(time.frame).toEqual(1)
      expect(time.fps).toEqual(30)
    })
  })
  describe("createFromSeconds", () => {
    test("throws when seconds is invalid", () => {
      const frameString = <number><unknown>"0"
      expect(() => Time.fromSeconds(frameString, 1)).toThrow(Errors.seconds)
      expect(() => Time.fromSeconds(-1, 1)).toThrow(Errors.seconds)
    })
    test("throws when fps is invalid", () => {
      const framesString = <number><unknown>"1"
      expect(() => Time.fromSeconds(0, framesString)).toThrow(Errors.fps)
      expect(() => Time.fromSeconds(0, 0)).toThrow(Errors.fps)
      expect(() => Time.fromSeconds(0, 1.1)).toThrow(Errors.fps)
    })
    test("returns zero frame and one fps for no arguments", () => {
      const time = Time.fromSeconds()
      expect(time.frame).toEqual(0)
      expect(time.fps).toEqual(1)
    })
    test("returns supplied frame and fps", () => {
      const seconds = 4
      const fps = 20
      const time = Time.fromSeconds(seconds, fps)
      expect(time.frame).toEqual(seconds * fps)
      expect(time.fps).toEqual(fps)
    })
    test("returns proper frame for float", () => {
      const seconds = 4.55
      const fps = 10
      const time = Time.fromSeconds(seconds, fps, "floor")
      expect(time.frame).toEqual(45)
    })
  })
})

describe("Time", () => {
  const makeTimes = (quantize = 1, count = 100) => (
    (new Array(count).fill(true)).map((_, i) => (
      Time.fromArgs(i, quantize)
    ))
  )

  const times1 = makeTimes()
  const times10 = makeTimes(10)
  const times30 = makeTimes(30)
  describe("constructor", () => {
    test("throws when frame is invalid", () => {
      const frameString = <number><unknown>"0" // so we can actually call it
      expect(() => Time.fromArgs(frameString, 1)).toThrow(Errors.frame)
      expect(() => Time.fromArgs(-1, 1)).toThrow(Errors.frame)
      expect(() => Time.fromArgs(0.1, 1)).toThrow(Errors.frame)
    })
    test("throws when fps is invalid", () => {
      const fpsString = <number><unknown>"1" // so we can actually call it
      expect(() => Time.fromArgs(0, fpsString)).toThrow(Errors.fps)
      expect(() => Time.fromArgs(0, 0)).toThrow(Errors.fps)
      expect(() => Time.fromArgs(0, 1.1)).toThrow(Errors.fps)
    })
    test("returns zero frame and one fps for no arguments", () => {
      const time = Time.fromArgs()
      expect(time.frame).toEqual(0)
      expect(time.fps).toEqual(1)
    })
    test("supplied frame and fps", () => {
      const frame = 4
      const fps = 20
      const time = Time.fromArgs(frame, fps)
      expect(time.frame).toEqual(frame)
      expect(time.fps).toEqual(fps)
    })
  })
  describe("equalsTime", () => {
    const mins = [
      ["equal", [times1[0], times10[0], times30[0]]],
      ["equal", [times1[1], times10[10], times30[30]]],
      ["callee is earlier", [times10[0], times10[1], times10[0]]],
      ["callee is earlier", [times10[1], times1[1], times10[1]]],
      ["callee is later", [times10[1], times10[0], times10[0]]],
      ["callee is later", [times1[1], times10[1], times10[1]]],
    ]
    describe.each(mins)("when %s", (_, examples) => {
      const [time1, time2, expected] = examples as Time[]
      test(`${time1}.min(${time2}) returns ${expected}`, () => {
        expect(time1.min(time2).equalsTime(expected)).toBeTruthy()
      })
    })
  })
  describe("scale", () => {
    test("returns scaled time", () => {
      const time = Time.fromArgs(1, 30)
      const scaled = time.scale(10)
      expect(scaled.frame).toEqual(0)
    })
  })
})
