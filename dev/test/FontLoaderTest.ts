import { registerFont } from "canvas"
import { Cache } from "../../src/Loading/Cache"
import { FontLoader } from "../../src/Mash/Font/FontLoader"
import path from 'path'
import { LoadFontPromise } from "../../src/declarations"


export class FontLoaderTest extends FontLoader {
  requestUrl(url : string) : LoadFontPromise {
    const { baseURI } = document
    const file = url.startsWith(baseURI) ? url.slice(baseURI.length) : url
    const filePath = path.resolve(__dirname, '..', file)
    const family = Cache.key(url)
    const object = { family }

    registerFont(filePath, object)
    // const { fonts } = document
    // const font = [...fonts.keys()].find(font => font.family === family)

    // console.debug(this.constructor.name, "requestUrl", object, font)
    return Promise.resolve(object)
  }
}
