
import { describe, test } from 'node:test'
import assert from 'assert'
import { isInteger, isPositive } from './guards.js'
import { isNumber, isNumberOrNaN, isString } from "@moviemasher/runtime-shared"

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
  describe('isNumberOrNaN', () => {
    test('returns false for string numbers', () => {
      assert(!isNumberOrNaN('57'))
    })
  })
  describe('isNumber', () => {
    test('returns false for string numbers', () => {
      assert(!isNumber('57'))
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

  describe('isString', () => {
    test('returns true for strings, regardless of content', () => {
      assert(isString(''))
      " 1s'!".split('').forEach(character => {
        assert(isString(character))
      })
    })

    test('returns false for non-strings', () => {
      assert(!isString(1))
      assert(!isString(0))
      assert(!isString([]))
      assert(!isString({}))
      assert(!isString({ foo: 'bar' }))
      assert(!isString(['']))
      assert(!isString(undefined))
      assert(!isString(null))
      assert(!isString(true))
      assert(!isString(false))
    })
  })  
})
