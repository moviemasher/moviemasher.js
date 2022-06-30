import { isInteger, isPositive, isString } from "./Is"

describe("Is", () => {
  describe("integer", () => {
    test("returns true for integers, and rounded floats", () => {
      expect(isInteger(1)).toBe(true)
      expect(isInteger(1.0)).toBe(true)
      expect(isInteger(0)).toBe(true)
      expect(isInteger(0.0)).toBe(true)
      expect(isInteger(-1)).toBe(true)
    })
    test("returns false for floats and other", () => {
      expect(isInteger(1.000001)).toBe(false)
      expect(isInteger('1')).toBe(false)
      expect(isInteger([1])).toBe(false)
      expect(isInteger(-0.00000001)).toBe(false)
      expect(isInteger(0.1)).toBe(false)
      expect(isInteger(undefined)).toBe(false)
      expect(isInteger(null)).toBe(false)
      expect(isInteger(true)).toBe(false)
      expect(isInteger(false)).toBe(false)
    })
  })
  describe("positive", () => {
    test("return true for numbers greater or equal to zero", () => {
      expect(isPositive(0.4)).toBe(true)
      expect(isPositive(1000.000222)).toBe(true)
    })
  })
  describe("string", () => {
    test("returns true for strings, regardless of content", () => {
      expect(isString("")).toBe(true)
      " 1s'!".split('').forEach(character => {
        expect(isString(character)).toBe(true)
      })
    })
    test("returns false for non-strings", () => {
      expect(isString(1)).toBe(false)
      expect(isString(0)).toBe(false)
      expect(isString([])).toBe(false)
      expect(isString({})).toBe(false)
      expect(isString({ foo: 'bar' })).toBe(false)
      expect(isString([""])).toBe(false)
      expect(isString(undefined)).toBe(false)
      expect(isString(null)).toBe(false)
      expect(isString(true)).toBe(false)
      expect(isString(false)).toBe(false)
    })
  })
})
