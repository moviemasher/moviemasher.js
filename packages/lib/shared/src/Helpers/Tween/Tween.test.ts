import { describe, test } from 'node:test'
import assert from 'assert'


import { tweenPad, tweenScaleSizeToRect } from './TweenFunctions.js'
import { Rect, Size } from '@moviemasher/runtime-shared'
import { SideDirectionObject } from '@moviemasher/runtime-shared'

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
    type TestCase = [string, Size, Rect, SideDirectionObject, Rect]
    const testCases: TestCase[] = [
      [
        'returns properly scaled rect', 
        { width: 480, height: 270 }, 
        { x: 1, y: 1, width: 0.25, height: 0.25 }, 
        {},
        { width: 120, height: 68, x: 360, y: 202 }
      ],
    ]

    testCases.forEach(array => {
      const [label, dimensions, rect, directionObject, result] = array
      test(label, () => {
        assert.deepStrictEqual(tweenScaleSizeToRect(dimensions, rect, directionObject), result)
      })
    })
  })
})
