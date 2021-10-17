import { Pixel } from "./Pixel"

describe("Pixel", () => {
  describe("perFrame", () => {

    test("returns zero for zero frames", () => expect(Pixel.perFrame(0, 100, 1)).toEqual(0))
    test("returns zero for zero width", () => expect(Pixel.perFrame(10, 0, 1)).toEqual(0))

    test("returns ten for one zoom when frames < width", () => expect(Pixel.perFrame(10, 100, 1)).toEqual(10))
    test("returns one for one zoom when frames > width", () => expect(Pixel.perFrame(100, 10, 1)).toEqual(1))


    test("returns", () => expect(Pixel.perFrame(10, 100, 0.5)).toEqual(5.5))
  })
  describe("toFrame", () => {
    test("converts properly between fromFrame", () => {
      const pixel = 10
      const perFrame = 0.2
      expect(Pixel.fromFrame(Pixel.toFrame(pixel, perFrame), perFrame)).toEqual(pixel)
    })
  })
})
