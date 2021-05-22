import { MediaType } from "../Setup"
import { ScalerMedia } from "../Media"
import { Module } from "../Setup"
import { MediaFactory } from "./MediaFactory"

describe("MediaFactory", () => {
  const scaler_configuration = Module.defaultOfType(MediaType.scaler)

  test("create", () => {
    const media = MediaFactory.create(scaler_configuration)
    expect(media).toBeInstanceOf(ScalerMedia)
  })
})