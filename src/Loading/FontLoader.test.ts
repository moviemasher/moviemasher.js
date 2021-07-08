import { LoaderFactory } from "./LoaderFactory"
import { FontLoader } from "./FontLoader"

describe("FontLoader", () => {
  const url = "Assets/BlackoutTwoAM.ttf"
  const loader = LoaderFactory.font()

  describe("constructor", () => {
    test("returns FontLoader instance", () => {
      expect(loader).toBeInstanceOf(FontLoader)
    })
  })
  describe("requestUrl", () => {
    test("returns object with family key", async () => {
      const result = await loader.requestUrl(url)
      expect(result).toBeInstanceOf(Object)
      expect(result.family).toBeTruthy()
    })
  })
})
