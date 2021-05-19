import { ModuleType } from "./Types"
import { Module } from "./Module"

describe("Module", () => {
  const types = [ModuleType.font, ModuleType.scaler, ModuleType.merger]
  describe.each(types)("defaultOfType(%s)", (type) => {

    const module = Module.defaultOfType(type)
    test("returns Object instance", () => {
      expect(module).toBeInstanceOf(Object)
      expect(module.id).toEqual(`com.moviemasher.${type}.default`)
      expect(module.type).toEqual(type)
    })
  })
  describe("themeById", () => {
    test("returns object", () => {
      const theme = Module.themeById('com.moviemasher.theme.color')
      expect(theme).toBeInstanceOf(Object)
    })
  })
})
