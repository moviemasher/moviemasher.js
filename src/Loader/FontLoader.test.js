import { LoadType } from "../Types"
import { LoaderFactory } from "../Factory/LoaderFactory"
import { FontLoader } from "./FontLoader"

describe("FontLoader", () => {
  const url = "../examples/javascript/media/font/blackout/theleagueof-blackout/webfonts/blackout_two_am-webfont.ttf"
  const loader = LoaderFactory.create(LoadType.font)
  
  describe("constructor", () => {
    test("returns FontLoader instance", () => {
      expect(loader).toBeInstanceOf(FontLoader)
    })
  })
  describe("loadUrl", () => {
    test("returns object with family key", async () => {
      const result = await loader.loadUrl(url)
      expect(result).toBeInstanceOf(Object)
      expect(result.family).toBeTruthy()
    })
  })
})