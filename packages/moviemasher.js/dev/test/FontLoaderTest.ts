import path from 'path'
import { registerFont } from "canvas"
import { LoadFontPromise } from "../../src/declarations"
import { cacheKey } from "../../src/Loader/Cache"
import { FontLoader } from "../../src/Media/Font/FontLoader"


export class FontLoaderTest extends FontLoader {
  protected override requestUrl(url : string) : LoadFontPromise {
    const { baseURI } = document
    const file = url.startsWith(baseURI) ? url.slice(baseURI.length) : url
    const filePath = path.resolve(__dirname, './assets', file)
    const family = cacheKey(url)
    const object = { family }

    registerFont(filePath, object)
    // const { fonts } = document
    // const font = [...fonts.keys()].find(font => font.family === family)

    // console.debug(this.constructor.name, "requestUrl", object, font)
    return Promise.resolve(object)
  }
}
