
import assert from 'assert'
import { describe, test } from 'node:test'
import { isInteger, isPositive } from '../../packages/@moviemasher/shared-lib/src/utility/guard.js'

describe('Basic Guards', () => {
  describe('isInteger', () => {
    test('returns true for integers, and rounded floats', () => {
      assert(isInteger(1))
      assert(isInteger(1.0))
      assert(isInteger(0))
      assert(isInteger(0.0))
      assert(isInteger(-1))
    })

    test('returns false for floats and other', () => {
      assert(!isInteger(1.000001))
      assert(!isInteger('1'))
      assert(!isInteger([1]))
      assert(!isInteger(-0.00000001))
      assert(!isInteger(0.1))
      assert(!isInteger(undefined))
      assert(!isInteger(null))
      assert(!isInteger(true))
      assert(!isInteger(false))
    })
  })
  
  describe('isPositive', () => {
    test('returns true for numbers greater or equal to zero', () => {
      assert(isPositive(0.4))
      assert(isPositive(1000.000222))
      assert(isPositive(0))
    })
    test('returns false for numbers less than zero', () => {
      assert(!isPositive(-1))
    })
  })
})
