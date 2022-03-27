import { pixelFromFrame, pixelPerFrame, pixelToFrame } from "./Pixel"

describe("Pixel", () => {
  describe("perFrame", () => {

    test("returns zero for zero frames", () => expect(pixelPerFrame(0, 100, 1)).toEqual(0))
    test("returns zero for zero width", () => expect(pixelPerFrame(10, 0, 1)).toEqual(0))

    test("returns ten for one zoom when frames < width", () => expect(pixelPerFrame(10, 100, 1)).toEqual(10))
    test("returns one for one zoom when frames > width", () => expect(pixelPerFrame(100, 10, 1)).toEqual(1))


    test("returns", () => expect(pixelPerFrame(10, 100, 0.5)).toEqual(5.5))
  })
  describe("toFrame", () => {
    test("converts properly between fromFrame", () => {
      const pixel = 10
      const perFrame = 0.2
      expect(pixelFromFrame(pixelToFrame(pixel, perFrame), perFrame)).toEqual(pixel)
    })
  })
})
