import { describe, test } from 'node:test'
import assert from 'assert'

import { 
   pixelToFrame 
} from "@moviemasher/moviemasher.js"
import { 
  pixelFromFrame, pixelPerFrame, 
} from "@moviemasher/client-core"

describe("Pixel", () => {
  describe("perFrame", () => {

    test("returns zero for zero frames", () => assert.equal(pixelPerFrame(0, 100, 1), 0))
    test("returns zero for zero width", () => assert.equal(pixelPerFrame(10, 0, 1), 0))

    test("returns ten for one zoom when frames < width", () => assert.equal(pixelPerFrame(10, 100, 1), 10))
    test("returns one for one zoom when frames > width", () => assert.equal(pixelPerFrame(100, 10, 1), 1))


    test("returns", () => assert.equal(pixelPerFrame(10, 100, 0.5), 5.5))
  })
  describe("toFrame", () => {
    test("converts properly between fromFrame", () => {
      const pixel = 10
      const perFrame = 0.2
      assert.equal(pixelFromFrame(pixelToFrame(pixel, perFrame), perFrame), pixel)
    })
  })
})
