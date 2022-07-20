import { Rect } from "./Rect"
import { sizePad, Size } from "./Size"
import { tweenScaleSizeToRect } from "./Tween"

describe("Size", () => {
  describe("sizePad", () => {
    type DimensionPad = [string, number, number, number, boolean, number]
    const testCases: DimensionPad[] = [
      ['problem', 480, 480 * 0.25, 1, true, 360],
    ]
    test.each(testCases)("%s", (label, dimensions, rect, constrainX, constrainY, result) => {
      expect(sizePad(dimensions, rect, constrainX, constrainY)).toEqual(result)
    })
  })
  describe("tweenScaleSizeToRect", () => {
    type DimensionsTransformToRect = [string, Size, Rect, boolean, boolean, Rect]
    const testCases: DimensionsTransformToRect[] = [
      ['problem', { width: 480, height: 270 }, { x: 1, y: 1, width: 0.25, height: 0.25 }, true, true, { width: 120, height: 68, x: 360, y: 202 }],
    ]
    test.each(testCases)("%s", (label, dimensions, rect, constrainX, constrainY, result) => {
      expect(tweenScaleSizeToRect(dimensions, rect, constrainX, constrainY)).toEqual(result)
    })
  })
  
})
