import { labelInterpolate } from "./Label"

describe("Label", () => {
  describe("labelInterpolate", () => {
    test("correctly replaces substrings", () => {
      expect(labelInterpolate('remove', { type: 'clip' })).toEqual('Remove Clip')
    })
  })
})