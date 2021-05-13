import { Is } from "./Is"

describe("Is", () => {
  const strings = [
    ["string", true],
    ["1", true],
    ["", true],
    [1, false],
    [null, false],
    [undefined, false],
    [true, false],
    [false, false],
  ]
  test.each(strings)("string(%s) returns %s", (arg, expected) => {
    expect(Is.string(arg)).toEqual(expected)
  })
  describe("empty", () => {
    const things = [
      [true, ""],
      [false, "string"]
    ]
    test.each(things)("returns %s for %s", (expected, arg) => {
      expect(Is.empty(arg)).toEqual(expected)
    })
  })
})