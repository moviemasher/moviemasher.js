import type { Lock, PropertySize, Rect, RectTuple, Size, SideDirectionRecord, Rects } from '@moviemasher/runtime-shared'

import { describe, test } from 'node:test'
import assert from 'assert'


import { tweenPad, tweenRectsContainer, tweenScaleSizeToRect } from './TweenFunctions.js'
import { LockHeight, LockNone } from '../../../Setup/LockConstants.js'

describe('Tween', () => {
  describe('tweenPad', () => {
    type TestCase = [string, number, number, number, boolean, boolean, number]
    const testCases: TestCase[] = [
      ['returns properly padded rect', 480, 480 * 0.25, 1, false, false, 360],
    ]
    testCases.forEach(array => {
      const [label, outWidth, scaleWidth, scaleX, constrainE, constrainW, result] = array
      test(label, () => {
        assert.deepStrictEqual(tweenPad(outWidth, scaleWidth, scaleX, constrainE, constrainW), result)
      })
    })
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
        'returns rect half size in bottom right offscreen', 
        { width: 2000, height: 1000 }, 
        { x: 1, y: 1, width: 0.5, height: 0.5 }, 
        { left: true, right: true, top: true, bottom: true },
        { width: 1000, height: 500, x: 2000, y: 1000 }
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

  describe('tweenRectsContainer', () => {
    type TestCase = [string, Rects, Rect, Lock, Size, SideDirectionRecord, string, string, Rects]

    const testCases: TestCase[] = [
      [
        'returns properly tweened rect', 
        [{ x: 0.5, y: 0.5, width: 1, height: 1 }], 
        { x: 0, y: 0, width: 1000, height: 1000},
        LockHeight, 
        { width: 200, height: 100 },
        {},
        'flip',
        'flip',
        [{ x: 50, y: 0, width: 100, height: 100 }], 
      ],
    ]

    testCases.forEach(array => {
      const [label, tweenRects, intrinsicRect, lock, previewSize, directionRecord, pointAspect, sizeAspect, result] = array
      test(label, () => {
        assert.deepStrictEqual(tweenRectsContainer(tweenRects, intrinsicRect, lock, previewSize, directionRecord, pointAspect, sizeAspect), result)
      })
    })
  })
})