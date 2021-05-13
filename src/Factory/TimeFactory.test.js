import { Errors } from "../Errors";
import { TimeFactory } from "./TimeFactory";



describe("TimeFactory", () => {
  describe("create", () => {
    test("returns supplied frame and fps", () => {
      const time = TimeFactory.create(1, 30)
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