import { ModuleType } from "../Types"
import { ScalerMedia } from "../Media"
import { Module } from "../Module"
import { Scaler } from "./Scaler"

describe("Scaler", () => {
  test("constructor", () => {
    const scaler = new Scaler(Module.objectWithDefaultId(ModuleType.scaler))
    expect(scaler).toBeInstanceOf(Scaler)
    expect(scaler.type).toEqual(ModuleType.scaler)
    expect(scaler.id).toEqual("com.moviemasher.scaler.default")
    // console.log("scaler.media", scaler.media)
    expect(scaler.media).toBeInstanceOf(ScalerMedia)
  })
})