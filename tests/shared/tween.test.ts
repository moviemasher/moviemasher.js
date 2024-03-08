import type { Lock, Rect, RectTuple, Rects, SideDirectionRecord, Size } from '../../packages/@moviemasher/shared-lib/src/types.js'

import assert from 'assert'
import { describe, test } from 'node:test'
import { $CEIL, $FLIP, $HEIGHT, $MAINTAIN, assertTuple } from '../../packages/@moviemasher/shared-lib/src/runtime.js'
import { containerEvaluationPoint, containerEvaluationSize, numberPoint, numberSize, tweenNumber } from '../../packages/@moviemasher/shared-lib/src/utility/rect.js'
import { timeRangeFromArgs } from '../../packages/@moviemasher/shared-lib/src/utility/time.js'


// tweenPoint: EvaluationPoint, containerSize: EvaluationSize, outputSize: Size, pointAspect: string, cropDirections: SideDirectionRecord, rounding: Rounding

//tweenSize: Size, intrinsicSize: Size, outputSize: Size, sizeAspect: string, rounding: Rounding, sizeKey?: SizeKey): EvaluationSize => {

const tweenScaleSizeToRect = (size: Size, scaleRect: Rect, directions: SideDirectionRecord): Rect => {
  const containerSize = numberSize(containerEvaluationSize(scaleRect, size, size, $MAINTAIN, $CEIL))
  const point = containerEvaluationPoint(scaleRect, containerSize, size, $MAINTAIN, directions, $CEIL)

  return {
    ...numberPoint(point),
    ...containerSize
  }
}

const containerRects = (rects: RectTuple, intrinsicSize: Size, lock: Lock, outputSize: Size, directions: SideDirectionRecord, pointAspect: string, sizeAspect: string): RectTuple => {
  const tweened = rects.map((rect, i) => {
    return tweenScaleSizeToRect(intrinsicSize, rect, directions)
  })
  assertTuple<Rect>(tweened)
  return tweened
}

describe('Tween', () => {
  
  test('tweenNumber', () => {
    const fps = 30
    const seconds = 3
    const totalFrames = fps * seconds
    const timeRange = timeRangeFromArgs(0, fps, totalFrames)
    const start = tweenNumber(0, 1, timeRange.startTime, timeRange)
    const end = tweenNumber(0, 1, timeRange.endTime, timeRange)
    console.log({ start, end })
    // arrayOfNumbers(totalFrames).forEach(frame => {
    //   const time = timeRangeFromArgs(frame, fps, totalFrames - frame)
    //   const number = tweenNumber(0, 1, timeRange.startTime, timeRange)
    //   console.log({ frame, number })
    // })
  })
  describe('tweenScaleSizeToRect', () => {
    type TestCase = [string, Size, Rect, SideDirectionRecord, Rect]
    const testCases: TestCase[] = [
      [
        'returns rect one quarter size in bottom right corner', 
        { width: 480, height: 270 }, 
        { x: 1, y: 1, width: 0.25, height: 0.25 }, 
        {},
        { width: 120, height: 68, x: 360, y: 202 }
      ],
      [
        'returns rect half size in bottom right of too large offscreen', 
        { width: 2000, height: 1000 }, 
        { x: 1, y: 1, width: 0.5, height: 0.5 }, 
        { left: true, right: true, top: true, bottom: true },
        { width: 1000, height: 500, x: 3000, y: 1500 }
      ],
      [
        'returns expected rect',
        { width: 100, height: 100 },
        { x: 0.5, y: 0.5, width: 1, height: 1 },
        {}, 
        { width: 100, height: 100, x: 0, y: 0 },
      ]
    ]

    testCases.forEach(array => {
      const [label, size, scaleRect, directions, result] = array
      test(label, () => {
        assert.deepStrictEqual(tweenScaleSizeToRect(size, scaleRect, directions), result)
      })
    })
  })

  describe('containerRects', () => {
    type TestCase = [string, RectTuple, Size, Lock, Size, SideDirectionRecord, string, string, Rects]
    const rect: Rect = { x: 0.5, y: 0.5, width: 1, height: 1 }
    const rects: RectTuple = [rect, rect]
    const expectedRect: Rect = { x: 0, y: 0, width: 100, height: 100 }
    const expectedRects: RectTuple = [expectedRect, expectedRect]

    const intrinsicSize: Size = { width: 100, height: 100 }
    const testCases: TestCase[] = [
      [
        'returns properly tweened rect', 
        rects, 
        intrinsicSize,
        $HEIGHT, 
        { width: 200, height: 100 },
        {},
        $FLIP,
        $FLIP,
        expectedRects, 
      ],
    ]

    testCases.forEach(array => {
      const [label, testRects, intrinsicRect, lock, outputSize, directionRecord, pointAspect, sizeAspect, result] = array
      test(label, () => {
        const tweened = containerRects(testRects, intrinsicRect, lock, outputSize, directionRecord, pointAspect, sizeAspect)
        assert.deepStrictEqual(tweened, result)
      })
    })
  })
})
