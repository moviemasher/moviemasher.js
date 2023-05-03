import { describe, test } from 'node:test'
import assert from 'assert'


import { tweenPad, tweenScaleSizeToRect } from '@moviemasher/lib-core'

describe('Tween', () => {
  describe('tweenPad', () => {
    const testCases = [
      ['problem', 480, 480 * 0.25, 1, false, false, 360],
    ]
    testCases.forEach(array => {
      const [label, outWidth, scaleWidth, scaleX, constrainE, constrainW, result] = array
      test(label, () => {
        assert.deepStrictEqual(tweenPad(outWidth, scaleWidth, scaleX, constrainE, constrainW), result)
      })
    })
  })

  describe('tweenScaleSizeToRect', () => {
    const testCases = [
      [
        'problem', 
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
