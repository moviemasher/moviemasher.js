import { Base } from "./Base"

describe("Base", () => {
  describe("constructor", () => {
    const throws = [
      "", "[Object]", 1, [], null,
    ]

    test.each(throws)("throws for %s", (invalid) => {
      expect(() => new Base(invalid)).toThrow()
    })
  })
  describe("object", () => {
    test("returns new object for undefined", () => {
      expect(new Base().object).toBeInstanceOf(Object)
    })

    test("returns object supplied to constructor", () => {
      const object = {}
      const base = new Base(object)
      expect(base).toBeInstanceOf(Base)
      expect(base.object).toBeInstanceOf(Object)
      if (object) expect(base.object).toStrictEqual(object)
    })
  })
})
