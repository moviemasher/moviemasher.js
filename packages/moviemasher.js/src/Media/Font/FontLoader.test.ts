import { cacheGetObject } from "../../Loader/Cache"
import { LoaderFactory } from "../../Loader/LoaderFactory"
import { FontLoader } from "./FontLoader"

describe("FontLoader", () => {
  const url = "BlackoutTwoAM.ttf"
  const loader = LoaderFactory.font()

  describe("constructor", () => {
    test("returns FontLoader instance", () => {
      expect(loader).toBeInstanceOf(FontLoader)
    })
  })
  describe("requestUrl", () => {
    test("returns object with family key", async () => {
      await loader.loadUrl(url)
      const result = cacheGetObject(url)
      expect(result).toBeInstanceOf(Object)
      expect(result.family).toBeTruthy()
    })
  })
})
