import { EffectMedia } from "../Media"
import { Module } from "../Setup"
import { ModuleType } from "../Setup"
import { Effect } from "./Effect"

describe("Effect", () => {
  const id = "com.moviemasher.effect.grayscale"
  const media = new EffectMedia(Module.effectById(id))
  const object = { media: media }
  const effect = new Effect(object)
  
  test("constructor", () => {
    expect(effect.type).toEqual(ModuleType.effect)
  })

  describe("toJSON", () => {
    test("returns expected effect", () => {
      const { id, label, type } = media
      const expected = { id, label, type }
      expect(effect.toJSON()).toEqual(expected)
    })
  })
  
})