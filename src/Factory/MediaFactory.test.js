import { MediaType } from "../Types"
import { ScalerMedia } from "../Media"
import { Module } from "../Module"
import { MediaFactory } from "./MediaFactory"

describe("MediaFactory", () => {
  const scaler_configuration = Module.defaultOfType(MediaType.scaler)

  test("create", () => {
    const media = MediaFactory.create(scaler_configuration)
    expect(media).toBeInstanceOf(ScalerMedia)
  })
})