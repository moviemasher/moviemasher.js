import { Is } from "./Is"

describe("Is", () => {
  describe("integer", () => {
    test("returns true for integers, and rounded floats", () => {
      expect(Is.integer(1)).toBe(true)
      expect(Is.integer(1.0)).toBe(true)
      expect(Is.integer(0)).toBe(true)
      expect(Is.integer(0.0)).toBe(true)
      expect(Is.integer(-1)).toBe(true)
    })
    test("returns false for floats and other", () => {
      expect(Is.integer(1.000001)).toBe(false)
      expect(Is.integer('1')).toBe(false)
      expect(Is.integer([1])).toBe(false)
      expect(Is.integer(-0.00000001)).toBe(false)
      expect(Is.integer(0.1)).toBe(false)
      expect(Is.integer(undefined)).toBe(false)
      expect(Is.integer(null)).toBe(false)
      expect(Is.integer(true)).toBe(false)
      expect(Is.integer(false)).toBe(false)
    })
  })
  describe("positive", () => {
    test("return true for numbers greater or equal to zero", () => {
      expect(Is.positive(0.4)).toBe(true)
      expect(Is.positive(1000.000222)).toBe(true)
    })
  })
  describe("string", () => {
    test("returns true for strings, regardless of content", () => {
      expect(Is.string("")).toBe(true)
      " 1s'!".split('').forEach(character => {
        expect(Is.string(character)).toBe(true)
      })
    })
    test("returns false for non-strings", () => {
      expect(Is.string(1)).toBe(false)
      expect(Is.string(0)).toBe(false)
      expect(Is.string([])).toBe(false)
      expect(Is.string({})).toBe(false)
      expect(Is.string({ foo: 'bar' })).toBe(false)
      expect(Is.string([""])).toBe(false)
      expect(Is.string(undefined)).toBe(false)
      expect(Is.string(null)).toBe(false)
      expect(Is.string(true)).toBe(false)
      expect(Is.string(false)).toBe(false)
    })
  })
})
