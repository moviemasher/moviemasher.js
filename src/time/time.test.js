
import { Errors } from "../Errors"
import { Time } from "./Time"
const quantize = 10

const times = (quantize = 1, count = 100) => {
  return (new Array(count).fill(true)).map((_, i) => { 
    return new Time(i, quantize) 
  })
}

const times1 = times()
const times10 = times(10)
const times30 = times(30)

describe("Time", () => {
  describe("constructor", () => {    
    test("throws when frame is invalid", () => {
      expect(() => new Time("0", 1)).toThrow(Errors.frame)
      expect(() => new Time(-1, 1)).toThrow(Errors.frame)
      expect(() => new Time(0.1, 1)).toThrow(Errors.frame)
    })
    test("throws when fps is invalid", () => {
      expect(() => new Time(0, "1")).toThrow(Errors.fps)
      expect(() => new Time(0, 0)).toThrow(Errors.fps)
      expect(() => new Time(0, 1.1)).toThrow(Errors.fps)
    })
    test("returns zero frame and one fps for no arguments", () => {
      const time = new Time
      expect(time.frame).toEqual(0)
      expect(time.fps).toEqual(1)
    })
    test("supplied frame and fps", () => {
      const frame = 4
      const fps = 20
      const time = new Time(frame, fps)
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
      const time = new Time(1, 30)
      const scaled = time.scale(10)
      expect(scaled.frame).toEqual(0)
    })
  })
})
