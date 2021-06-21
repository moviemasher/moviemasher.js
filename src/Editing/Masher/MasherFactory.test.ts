import { MasherClass } from "../Masher"
import { MasherFactory } from "./MasherFactory"

describe("MasherFactory", () => {
  describe("create", () => {
    test("returns a MasherClass instance", () => {
      const masher = MasherFactory.create()
      expect(masher).toBeInstanceOf(MasherClass)
      expect(MasherFactory.mashers.includes(masher)).toBeTruthy()
      expect(MasherFactory.interval).toBeGreaterThan(0)
    })
  })
})
