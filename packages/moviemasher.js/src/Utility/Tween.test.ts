import { DirectionObject, Directions } from "../Setup/Enums"
import { Rect } from "./Rect"
import { Size } from "./Size"
import { tweenPad, tweenScaleSizeToRect } from "./Tween"

describe("Tween", () => {
  describe("tweenPad", () => {
    type DimensionPad = [string, number, number, number, boolean, boolean, number]
    const testCases: DimensionPad[] = [
      ['problem', 480, 480 * 0.25, 1, false, false, 360],
    ]
    
    test.each(testCases)("%s", (label, outWidth, scaleWidth, scaleX, constrainE, constrainW, result) => {
      expect(tweenPad(outWidth, scaleWidth, scaleX, constrainE, constrainW)).toEqual(result)
    })
  })

  describe("tweenScaleSizeToRect", () => {
    type DimensionsTransformToRect = [string, Size, Rect, DirectionObject, Rect]
    const testCases: DimensionsTransformToRect[] = [
      [
        'problem', 
        { width: 480, height: 270 }, 
        { x: 1, y: 1, width: 0.25, height: 0.25 }, 
        {},//Object.fromEntries(Directions.map(direction => [direction, true])), 
        { width: 120, height: 68, x: 360, y: 202 }
      ],
    ]

    test.each(testCases)("%s", (label, dimensions, rect, directionObject, result) => {
      expect(tweenScaleSizeToRect(dimensions, rect, directionObject)).toEqual(result)
    })
  })
})
