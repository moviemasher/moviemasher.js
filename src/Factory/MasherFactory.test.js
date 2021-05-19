import { Masher } from "../Masher"
import { MasherFactory } from "./MasherFactory"

describe("MasherFactory", () => {
  describe("create", () => {
    test("returns a Masher instance", () => {
      const masher = MasherFactory.create()
      expect(masher).toBeInstanceOf(Masher)
      expect(MasherFactory.mashers.includes(masher)).toBeTruthy()
      expect(MasherFactory.interval).toBeGreaterThan(0)
    })
  })
})